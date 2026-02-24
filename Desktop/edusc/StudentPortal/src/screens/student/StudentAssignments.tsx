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

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  maxGrade?: number;
}

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/assignments/student/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'submitted':
        return '#17a2b8';
      case 'graded':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <Text style={styles.title}>My Assignments</Text>
      
      {assignments.length === 0 ? (
        <Text style={styles.noAssignments}>No assignments available</Text>
      ) : (
        assignments.map((assignment) => (
          <TouchableOpacity
            key={assignment._id}
            style={styles.assignmentCard}
            onPress={() => {
              // TODO: Navigate to assignment details
              console.log('Navigate to assignment:', assignment._id);
            }}
          >
            <View style={styles.assignmentHeader}>
              <Text style={styles.subject}>{assignment.subject}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(assignment.status) }
              ]}>
                <Text style={styles.statusText}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{assignment.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {assignment.description}
            </Text>

            <View style={styles.footer}>
              <Text style={styles.dueDate}>
                Due: {formatDate(assignment.dueDate)}
              </Text>
              {assignment.status === 'graded' && (
                <Text style={styles.grade}>
                  Grade: {assignment.grade}/{assignment.maxGrade}
                </Text>
              )}
            </View>
          </TouchableOpacity>
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
  noAssignments: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  assignmentCard: {
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subject: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
  },
  grade: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default StudentAssignments; 