import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Grade } from '../types';

const GradesScreen = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      let query = supabase.from('grades').select('*');
      
      if (user?.role === 'student') {
        query = query.eq('studentId', user.id);
      } else if (user?.role === 'teacher') {
        // Teachers can see grades for their subjects
        query = query.eq('teacherId', user.id);
      } else if (user?.role === 'parent') {
        // Parents can see grades for their children
        query = query.eq('studentId', 'child_id'); // This should be dynamic
      }

      const { data, error } = await query.order('term', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + (grade.marks / grade.totalMarks) * 100, 0);
    return (total / grades.length).toFixed(2);
  };

  const getGradesByTerm = (term: string) => {
    return grades.filter((grade) => grade.term === term);
  };

  const renderGradeCard = (term: string) => {
    const termGrades = getGradesByTerm(term);
    const average = calculateAverage(termGrades);

    return (
      <Card key={term}>
        <Card.Title>{term}</Card.Title>
        <Card.Divider />
        <Text style={styles.average}>Average: {average}%</Text>
        {termGrades.map((grade) => (
          <ListItem key={grade.id}>
            <ListItem.Content>
              <ListItem.Title>{grade.subject}</ListItem.Title>
              <ListItem.Subtitle>
                {grade.marks}/{grade.totalMarks} ({((grade.marks / grade.totalMarks) * 100).toFixed(2)}%)
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    );
  };

  const getUniqueTerms = () => {
    return [...new Set(grades.map((grade) => grade.term))];
  };

  return (
    <ScrollView style={styles.container}>
      {getUniqueTerms().map((term) => renderGradeCard(term))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  average: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default GradesScreen; 