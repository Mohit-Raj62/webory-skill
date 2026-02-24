import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';

interface ClassSchedule {
  _id: string;
  subject: string;
  teacher: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const StudentSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const today = new Date().getDay();
    return today >= 1 && today <= 5 ? DAYS[today - 1] : 'Monday';
  });

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`${API_URL}/api/schedule/student/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSchedule(data);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule();
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDaySchedule = (day: string) => {
    return schedule
      .filter((class_) => class_.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Schedule</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
      >
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDay === day && styles.selectedDayButtonText,
              ]}
            >
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scheduleContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getDaySchedule(selectedDay).length === 0 ? (
          <Text style={styles.noClasses}>No classes scheduled for {selectedDay}</Text>
        ) : (
          getDaySchedule(selectedDay).map((class_) => (
            <View key={class_._id} style={styles.classCard}>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>
                  {formatTime(class_.startTime)} - {formatTime(class_.endTime)}
                </Text>
              </View>

              <View style={styles.classDetails}>
                <Text style={styles.subject}>{class_.subject}</Text>
                <Text style={styles.teacher}>Teacher: {class_.teacher}</Text>
                <Text style={styles.room}>Room: {class_.room}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  daySelector: {
    flexGrow: 0,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedDayButton: {
    backgroundColor: '#0066cc',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
  },
  noClasses: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeContainer: {
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  classDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teacher: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  room: {
    fontSize: 14,
    color: '#666',
  },
});

export default StudentSchedule; 