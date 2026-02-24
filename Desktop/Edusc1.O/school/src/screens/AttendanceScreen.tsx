import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Attendance } from '../types';

const AttendanceScreen = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      let query = supabase.from('attendance').select('*');
      
      if (user?.role === 'student') {
        query = query.eq('studentId', user.id);
      } else if (user?.role === 'teacher') {
        query = query.eq('markedBy', user.id);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const { error } = await supabase.from('attendance').insert([
        {
          studentId,
          date: new Date().toISOString(),
          status,
          markedBy: user?.id,
        },
      ]);

      if (error) throw error;
      Alert.alert('Success', 'Attendance marked successfully');
      fetchAttendance();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTeacherView = () => (
    <View>
      <Card>
        <Card.Title>Mark Attendance</Card.Title>
        <Card.Divider />
        {/* This would be populated with actual student list */}
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>John Doe</ListItem.Title>
          </ListItem.Content>
          <View style={styles.buttonGroup}>
            <Button
              title="P"
              type="solid"
              onPress={() => markAttendance('student1', 'present')}
              containerStyle={styles.statusButton}
            />
            <Button
              title="A"
              type="outline"
              onPress={() => markAttendance('student1', 'absent')}
              containerStyle={styles.statusButton}
            />
            <Button
              title="L"
              type="outline"
              onPress={() => markAttendance('student1', 'late')}
              containerStyle={styles.statusButton}
            />
          </View>
        </ListItem>
      </Card>
    </View>
  );

  const renderStudentView = () => (
    <View>
      <Card>
        <Card.Title>My Attendance</Card.Title>
        <Card.Divider />
        {attendance.map((record) => (
          <ListItem key={record.id}>
            <ListItem.Content>
              <ListItem.Title>{new Date(record.date).toLocaleDateString()}</ListItem.Title>
              <ListItem.Subtitle>Status: {record.status}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {user?.role === 'teacher' ? renderTeacherView() : renderStudentView()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  statusButton: {
    marginHorizontal: 2,
    width: 40,
  },
});

export default AttendanceScreen; 