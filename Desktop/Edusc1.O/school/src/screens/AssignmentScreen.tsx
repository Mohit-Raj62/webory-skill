import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Input, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Assignment } from '../types';

const AssignmentScreen = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      let query = supabase.from('assignments').select('*');
      
      if (user?.role === 'student') {
        query = query.eq('classId', 'student_class_id'); // This should be dynamic
      } else if (user?.role === 'teacher') {
        query = query.eq('teacherId', user.id);
      }

      const { data, error } = await query.order('dueDate', { ascending: true });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase.from('assignments').insert([
        {
          ...newAssignment,
          teacherId: user?.id,
          classId: 'class_id', // This should be dynamic
        },
      ]);

      if (error) throw error;
      Alert.alert('Success', 'Assignment created successfully');
      setNewAssignment({ title: '', description: '', dueDate: '' });
      fetchAssignments();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTeacherView = () => (
    <View>
      <Card>
        <Card.Title>Create New Assignment</Card.Title>
        <Card.Divider />
        <Input
          placeholder="Title"
          value={newAssignment.title}
          onChangeText={(text) => setNewAssignment({ ...newAssignment, title: text })}
        />
        <Input
          placeholder="Description"
          value={newAssignment.description}
          onChangeText={(text) => setNewAssignment({ ...newAssignment, description: text })}
          multiline
          numberOfLines={3}
        />
        <Input
          placeholder="Due Date (YYYY-MM-DD)"
          value={newAssignment.dueDate}
          onChangeText={(text) => setNewAssignment({ ...newAssignment, dueDate: text })}
        />
        <Button
          title="Create Assignment"
          onPress={handleSubmitAssignment}
          containerStyle={styles.buttonContainer}
        />
      </Card>
    </View>
  );

  const renderStudentView = () => (
    <View>
      <Card>
        <Card.Title>My Assignments</Card.Title>
        <Card.Divider />
        {assignments.map((assignment) => (
          <ListItem key={assignment.id}>
            <ListItem.Content>
              <ListItem.Title>{assignment.title}</ListItem.Title>
              <ListItem.Subtitle>Due: {new Date(assignment.dueDate).toLocaleDateString()}</ListItem.Subtitle>
              <Text style={styles.description}>{assignment.description}</Text>
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
  buttonContainer: {
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default AssignmentScreen; 