import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';

interface Grade {
  _id: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  feedback: string;
  date: string;
}

const StudentGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGrades = async () => {
    try {
      const response = await fetch(`${API_URL}/api/grades/student/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGrades();
  };

  const calculateGrade = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
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
      <Text style={styles.title}>My Grades</Text>
      
      {grades.length === 0 ? (
        <Text style={styles.noGrades}>No grades available</Text>
      ) : (
        grades.map((grade) => (
          <View key={grade._id} style={styles.gradeCard}>
            <View style={styles.gradeHeader}>
              <Text style={styles.subject}>{grade.subject}</Text>
              <Text style={styles.assignment}>{grade.assignment}</Text>
            </View>
            
            <View style={styles.gradeDetails}>
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                  {grade.score}/{grade.maxScore}
                </Text>
                <Text style={[
                  styles.grade,
                  { color: calculateGrade(grade.score, grade.maxScore) === 'F' ? '#dc3545' : '#28a745' }
                ]}>
                  {calculateGrade(grade.score, grade.maxScore)}
                </Text>
              </View>
              
              {grade.feedback && (
                <Text style={styles.feedback}>{grade.feedback}</Text>
              )}
              
              <Text style={styles.date}>
                {new Date(grade.date).toLocaleDateString()}
              </Text>
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
  noGrades: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  gradeCard: {
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
  gradeHeader: {
    marginBottom: 12,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  assignment: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  gradeDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  grade: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default StudentGrades; 