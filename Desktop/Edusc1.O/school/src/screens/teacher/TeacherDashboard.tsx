import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TeacherDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Teacher Dashboard</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {/* Add classes component here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Assignments</Text>
          {/* Add assignments component here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          {/* Add attendance component here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Performance</Text>
          {/* Add performance component here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
});

export default TeacherDashboard; 