import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../../config';
import axios from 'axios';

interface DashboardData {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  recentActivities: {
    type: string;
    time: string;
    details: string;
  }[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.ADMIN.DASHBOARD), {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Total Students</Title>
            <Paragraph style={styles.statsNumber}>
              {dashboardData?.totalStudents || 0}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Total Teachers</Title>
            <Paragraph style={styles.statsNumber}>
              {dashboardData?.totalTeachers || 0}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Total Admins</Title>
            <Paragraph style={styles.statsNumber}>
              {dashboardData?.totalAdmins || 0}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.activitiesCard}>
        <Card.Content>
          <Title>Recent Activities</Title>
          {dashboardData?.recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityType}>{activity.type}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
              <Text style={styles.activityDetails}>{activity.details}</Text>
            </View>
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '30%',
    marginBottom: 10,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  activitiesCard: {
    margin: 10,
  },
  activityItem: {
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activityDetails: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default AdminDashboard; 