import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Timetable } from '../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableScreen = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      let query = supabase.from('timetable').select('*');
      
      if (user?.role === 'student') {
        query = query.eq('classId', 'student_class_id'); // This should be dynamic
      } else if (user?.role === 'teacher') {
        query = query.eq('teacherId', user.id);
      }

      const { data, error } = await query.order('dayOfWeek', { ascending: true });

      if (error) throw error;
      setTimetable(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimetableForDay = (dayIndex: number) => {
    return timetable.filter((item) => item.dayOfWeek === dayIndex);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderTimetableDay = (dayIndex: number) => {
    const daySchedule = getTimetableForDay(dayIndex);
    
    return (
      <Card key={dayIndex}>
        <Card.Title>{DAYS[dayIndex]}</Card.Title>
        <Card.Divider />
        {daySchedule.length > 0 ? (
          daySchedule.map((item) => (
            <ListItem key={item.id}>
              <ListItem.Content>
                <ListItem.Title>{item.subject}</ListItem.Title>
                <ListItem.Subtitle>
                  {formatTime(item.startTime)} - {formatTime(item.endTime)}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        ) : (
          <Text style={styles.noClasses}>No classes scheduled</Text>
        )}
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {DAYS.map((_, index) => renderTimetableDay(index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noClasses: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
  },
});

export default TimetableScreen; 