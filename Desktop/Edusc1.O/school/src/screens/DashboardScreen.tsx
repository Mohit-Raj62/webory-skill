import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen = () => {
  const { user, signOut } = useAuth();

  const renderAdminDashboard = () => (
    <View>
      <Card>
        <Card.Title>Admin Dashboard</Card.Title>
        <Card.Divider />
        <Text>Welcome, {user?.name}!</Text>
        <Text style={styles.stats}>Total Students: 150</Text>
        <Text style={styles.stats}>Total Teachers: 20</Text>
        <Text style={styles.stats}>Total Classes: 12</Text>
      </Card>
    </View>
  );

  const renderTeacherDashboard = () => (
    <View>
      <Card>
        <Card.Title>Teacher Dashboard</Card.Title>
        <Card.Divider />
        <Text>Welcome, {user?.name}!</Text>
        <Text style={styles.stats}>Classes Today: 5</Text>
        <Text style={styles.stats}>Pending Assignments: 3</Text>
        <Text style={styles.stats}>Unread Messages: 2</Text>
      </Card>
    </View>
  );

  const renderStudentDashboard = () => (
    <View>
      <Card>
        <Card.Title>Student Dashboard</Card.Title>
        <Card.Divider />
        <Text>Welcome, {user?.name}!</Text>
        <Text style={styles.stats}>Next Class: Mathematics</Text>
        <Text style={styles.stats}>Pending Assignments: 2</Text>
        <Text style={styles.stats}>Attendance: 95%</Text>
      </Card>
    </View>
  );

  const renderParentDashboard = () => (
    <View>
      <Card>
        <Card.Title>Parent Dashboard</Card.Title>
        <Card.Divider />
        <Text>Welcome, {user?.name}!</Text>
        <Text style={styles.stats}>Children: 2</Text>
        <Text style={styles.stats}>Unread Messages: 1</Text>
        <Text style={styles.stats}>Upcoming Events: 3</Text>
      </Card>
    </View>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'student':
        return renderStudentDashboard();
      case 'parent':
        return renderParentDashboard();
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderDashboard()}
      <Button
        title="Sign Out"
        onPress={signOut}
        containerStyle={styles.signOutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  stats: {
    fontSize: 16,
    marginVertical: 5,
  },
  signOutButton: {
    marginTop: 20,
    marginHorizontal: 10,
  },
});

export default DashboardScreen; 