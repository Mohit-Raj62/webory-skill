import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

const TeacherAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teacher/attendance/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return '#28a745';
      case 'absent':
        return '#dc3545';
      case 'late':
        return '#ffc107';
      case 'excused':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const filteredAttendance = attendance.filter(record => {
    if (selectedClass !== 'all' && record.class !== selectedClass) return false;
    if (selectedDate && record.date.split('T')[0] !== selectedDate) return false;
    return true;
  });

  const classes = Array.from(new Set(attendance.map(record => record.class)));

  const updateAttendanceStatus = async (recordId: string, newStatus: AttendanceRecord['status']) => {
    try {
      const response = await fetch(`${API_URL}/api/teacher/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Attendance</Text>

      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Class</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedClass === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedClass('all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedClass === 'all' && styles.filterButtonTextActive,
              ]}>All</Text>
            </TouchableOpacity>
            {classes.map((classItem) => (
              <TouchableOpacity
                key={classItem}
                style={[
                  styles.filterButton,
                  selectedClass === classItem && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedClass(classItem)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedClass === classItem && styles.filterButtonTextActive,
                ]}>{classItem}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Date</Text>
          <TextInput
            style={styles.dateInput}
            type="date"
            value={selectedDate}
            onChangeText={setSelectedDate}
          />
        </View>
      </View>

      {filteredAttendance.length === 0 ? (
        <Text style={styles.noRecords}>No attendance records available</Text>
      ) : (
        filteredAttendance.map((record) => (
          <View key={record._id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View>
                <Text style={styles.studentName}>{record.studentName}</Text>
                <Text style={styles.className}>{record.class}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(record.status) }
              ]}>
                <Text style={styles.statusText}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.date}>{formatDate(record.date)}</Text>

            {record.remarks && (
              <Text style={styles.remarks}>{record.remarks}</Text>
            )}

            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#28a745' }]}
                onPress={() => updateAttendanceStatus(record._id, 'present')}
              >
                <Text style={styles.statusButtonText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#dc3545' }]}
                onPress={() => updateAttendanceStatus(record._id, 'absent')}
              >
                <Text style={styles.statusButtonText}>Absent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#ffc107' }]}
                onPress={() => updateAttendanceStatus(record._id, 'late')}
              >
                <Text style={styles.statusButtonText}>Late</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#17a2b8' }]}
                onPress={() => updateAttendanceStatus(record._id, 'excused')}
              >
                <Text style={styles.statusButtonText}>Excused</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filters: {
    marginBottom: 20,
  },
  filterItem: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: '#0066cc',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  dateInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noRecords: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  remarks: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TeacherAttendance; 