import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS, getApiUrl } from '../../config';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DashboardData {
  overallGrade: number;
  pendingAssignments: number;
  attendanceRate: number;
  upcomingClasses: {
    subject: string;
    time: string;
    room: string;
  }[];
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.STUDENT.DASHBOARD), {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
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
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.firstName} {user?.lastName}
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Overall Grade</Title>
            <Paragraph style={styles.statValue}>{dashboardData?.overallGrade || 0}%</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Pending Assignments</Title>
            <Paragraph style={styles.statValue}>{dashboardData?.pendingAssignments || 0}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Attendance Rate</Title>
            <Paragraph style={styles.statValue}>{dashboardData?.attendanceRate || 0}%</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Today's Schedule</Title>
          {dashboardData?.upcomingClasses.map((class_, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View>
                <Text style={styles.subjectText}>{class_.subject}</Text>
                <Text style={styles.timeText}>{class_.time}</Text>
              </View>
              <Text style={styles.roomText}>{class_.room}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={[styles.section, { marginBottom: insets.bottom + 16 }]}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => {}}
            >
              View Assignments
            </Button>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Check Grades
            </Button>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => {}}
            >
              View Attendance
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  statsCard: {
    flex: 1,
    margin: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    margin: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#666',
  },
  roomText: {
    color: '#666',
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
});

export default Dashboard; 