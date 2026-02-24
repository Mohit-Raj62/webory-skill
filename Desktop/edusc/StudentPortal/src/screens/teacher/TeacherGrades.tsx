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

interface Grade {
  _id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  feedback?: string;
  submittedAt: string;
}

const TeacherGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const fetchGrades = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teacher/grades/${user?._id}`, {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateGrade = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return '#28a745';
      case 'B':
        return '#17a2b8';
      case 'C':
        return '#ffc107';
      case 'D':
        return '#fd7e14';
      case 'F':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const filteredGrades = grades.filter(grade => {
    if (selectedClass !== 'all' && grade.class !== selectedClass) return false;
    if (selectedSubject !== 'all' && grade.subject !== selectedSubject) return false;
    return true;
  });

  const classes = Array.from(new Set(grades.map(grade => grade.class)));
  const subjects = Array.from(new Set(grades.map(grade => grade.subject)));

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
      <Text style={styles.title}>Grades</Text>

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
          <Text style={styles.filterLabel}>Subject</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedSubject === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedSubject('all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedSubject === 'all' && styles.filterButtonTextActive,
              ]}>All</Text>
            </TouchableOpacity>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.filterButton,
                  selectedSubject === subject && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedSubject(subject)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedSubject === subject && styles.filterButtonTextActive,
                ]}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {filteredGrades.length === 0 ? (
        <Text style={styles.noGrades}>No grades available</Text>
      ) : (
        filteredGrades.map((grade) => {
          const gradeLetter = calculateGrade(grade.score, grade.maxScore);
          return (
            <View key={grade._id} style={styles.gradeCard}>
              <View style={styles.gradeHeader}>
                <View>
                  <Text style={styles.studentName}>{grade.studentName}</Text>
                  <Text style={styles.assignmentName}>{grade.assignment}</Text>
                </View>
                <View style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeColor(gradeLetter) }
                ]}>
                  <Text style={styles.gradeText}>{gradeLetter}</Text>
                </View>
              </View>

              <View style={styles.gradeDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Score</Text>
                  <Text style={styles.detailValue}>
                    {grade.score}/{grade.maxScore}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Class</Text>
                  <Text style={styles.detailValue}>{grade.class}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Subject</Text>
                  <Text style={styles.detailValue}>{grade.subject}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Submitted</Text>
                  <Text style={styles.detailValue}>{formatDate(grade.submittedAt)}</Text>
                </View>
              </View>

              {grade.feedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Feedback</Text>
                  <Text style={styles.feedbackText}>{grade.feedback}</Text>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                  <Text style={styles.actionButtonText}>Edit Grade</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.feedbackButton]}>
                  <Text style={styles.actionButtonText}>Add Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  assignmentName: {
    fontSize: 14,
    color: '#666',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    width: '50%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  feedbackContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#0066cc',
  },
  feedbackButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TeacherGrades; 