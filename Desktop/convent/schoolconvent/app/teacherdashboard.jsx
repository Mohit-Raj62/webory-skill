import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions, Animated } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cardAnimation] = useState(new Animated.Value(0));

  // Add navigation handler for attendance
  const handleMarkAttendance = () => {
    navigation.navigate('attendancemark');
  };

  // Mock teacher data
  const teacherInfo = {
    name: 'Dr. Sarah Johnson',
    id: 'TCH20240423',
    department: 'Science',
    subjects: ['Physics', 'Chemistry' , 'Maths'],
    photoUrl: 'https://via.placeholder.com/150',
  };

  // Mock class schedule
  const classSchedule = [
    { id: 1, subject: 'Physics', class: 'Class XI-A', time: '9:00 AM - 10:00 AM', room: 'Lab 1' },
    { id: 2, subject: 'Chemistry', class: 'Class XII-B', time: '10:00 AM - 11:00 PM', room: 'Lab 2' },
    { id: 3, subject: 'Physics', class: 'Class X-A', time: '12:00 PM - 1:00 PM', room: 'Room 101' },
    { id: 4, subject: 'Physics', class: 'Class X-A', time: '1:00 PM - 2:00 PM', room: 'Room 101' },
    { id: 5, subject: 'Physics', class: 'Class X-A', time: '2:00 PM - 3:00 PM', room: 'Room 101' },
    { id: 6, subject: 'Physics', class: 'Class X-A', time: '4:00 PM - 5:00 PM', room: 'Room 101' },
  ];

  // Mock assignments
  const assignments = [
    { id: 1, subject: 'Physics', title: 'Newton\'s Laws Lab Report', dueDate: '25 Apr', submissions: 15, total: 30 },
    { id: 2, subject: 'Chemistry', title: 'Chemical Reactions Quiz', dueDate: '26 Apr', submissions: 20, total: 30 },
  ];

  // Mock announcements
  const announcements = [
    { id: 1, title: 'Science Fair', message: 'Annual Science Fair will be held next week. All students must participate.', date: '22 Apr' },
    { id: 2, title: 'Lab Safety', message: 'New lab safety guidelines have been updated. Please review with your classes.', date: '20 Apr' },
  ];

  // Animation effect
  React.useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      cardAnimation.setValue(0);
    };
  }, [activeTab]);

  // Render different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'classes':
        return renderClasses();
      case 'assignments':
        return renderAssignments();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  // Dashboard content
  const renderDashboard = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Teacher Summary Card */}
      <Animated.View style={[styles.summaryCard, {
        opacity: cardAnimation,
        transform: [{ translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }]}>
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.gradientHeader}
        >
          <Image source={{ uri: teacherInfo.photoUrl }} style={styles.profileImage} />
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherNameLight}>{teacherInfo.name}</Text>
            <Text style={styles.teacherDetailLight}>ID: {teacherInfo.id}</Text>
            <Text style={styles.teacherDetailLight}>Department: {teacherInfo.department}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.quickActionContainer}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={handleMarkAttendance}
        >
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="how-to-reg" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Mark Attendance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="assignment" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Assignments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="schedule" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#9C27B0', '#7B1FA2']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="assessment" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Results</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Classes */}
      <Animated.View style={[styles.sectionContainer, {
        opacity: cardAnimation,
        transform: [{ translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <TouchableOpacity onPress={() => setActiveTab('classes')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {classSchedule.map(classItem => (
          <View key={classItem.id} style={styles.classItem}>
            <View style={styles.classTimeContainer}>
              <Text style={styles.classTime}>{classItem.time}</Text>
            </View>
            <View style={styles.classDetails}>
              <Text style={styles.classSubject}>{classItem.subject}</Text>
              <Text style={styles.classInfo}>{classItem.class} | {classItem.room}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Recent Assignments */}
      <Animated.View style={[styles.sectionContainer, {
        opacity: cardAnimation,
        transform: [{ translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0]
        })}]
      }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Assignments</Text>
          <TouchableOpacity onPress={() => setActiveTab('assignments')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {assignments.map(assignment => (
          <View key={assignment.id} style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
              <Text style={styles.assignmentDue}>Due: {assignment.dueDate}</Text>
            </View>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <View style={styles.submissionInfo}>
              <Text style={styles.submissionText}>
                Submissions: {assignment.submissions}/{assignment.total}
              </Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Announcements */}
      <Animated.View style={[styles.sectionContainer, {
        opacity: cardAnimation,
        transform: [{ translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 0]
        })}]
      }]}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        
        {announcements.map(announcement => (
          <View key={announcement.id} style={styles.announcementItem}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementDate}>{announcement.date}</Text>
            </View>
            <Text style={styles.announcementMessage}>{announcement.message}</Text>
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );

  // Classes tab content
  const renderClasses = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.pageTitle}>Class Schedule</Text>
        
        {/* Day selector */}
        <View style={styles.daySelector}>
          <TouchableOpacity style={[styles.dayButton, styles.activeDayButton]}>
            <Text style={styles.activeDayText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dayButton}>
            <Text style={styles.dayText}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dayButton}>
            <Text style={styles.dayText}>Weekly</Text>
          </TouchableOpacity>
        </View>
        
        {/* Full schedule */}
        {classSchedule.map(classItem => (
          <View key={classItem.id} style={styles.fullClassItem}>
            <View style={styles.classTimeBox}>
              <Text style={styles.classTimeText}>{classItem.time}</Text>
            </View>
            <View style={styles.fullClassDetails}>
              <Text style={styles.fullClassSubject}>{classItem.subject}</Text>
              <Text style={styles.fullClassInfo}>{classItem.class}</Text>
              <Text style={styles.fullClassRoom}>Room: {classItem.room}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Assignments tab content
  const renderAssignments = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.pageTitle}>Assignments</Text>
        
        {/* Assignment filter */}
        <View style={styles.assignmentFilter}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
            <Text style={styles.activeFilterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Completed</Text>
          </TouchableOpacity>
        </View>
        
        {/* Full assignments list */}
        {assignments.map(assignment => (
          <View key={assignment.id} style={styles.fullAssignmentItem}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
              <Text style={styles.assignmentDue}>Due: {assignment.dueDate}</Text>
            </View>
            <Text style={styles.fullAssignmentTitle}>{assignment.title}</Text>
            <View style={styles.submissionStats}>
              <Text style={styles.submissionText}>
                Submissions: {assignment.submissions}/{assignment.total}
              </Text>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Profile tab content
  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.profileHeader}
      >
        <Image source={{ uri: teacherInfo.photoUrl }} style={styles.largeProfileImage} />
        <Text style={styles.profileNameLight}>{teacherInfo.name}</Text>
        <Text style={styles.profileDepartmentLight}>{teacherInfo.department}</Text>
      </LinearGradient>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="person" size={20} color="#4285F4" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Teacher ID</Text>
          <Text style={styles.infoValue}>{teacherInfo.id}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Department</Text>
          <Text style={styles.infoValue}>{teacherInfo.department}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Subjects</Text>
          <Text style={styles.infoValue}>{teacherInfo.subjects.join(', ')}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editProfileButton}>
        <LinearGradient
          colors={['#4285F4', '#2575FC']}
          style={styles.editProfileGradient}
        >
          <MaterialIcons name="edit" size={18} color="white" style={styles.editIcon} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerTitleLight}>Teacher Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={28} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderTabContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('dashboard')}
        >
          <MaterialIcons 
            name="dashboard" 
            size={24} 
            color={activeTab === 'dashboard' ? '#4285F4' : '#9E9E9E'} 
          />
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.activeNavText]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('classes')}
        >
          <MaterialIcons 
            name="class" 
            size={24} 
            color={activeTab === 'classes' ? '#4285F4' : '#9E9E9E'} 
          />
          <Text style={[styles.navText, activeTab === 'classes' && styles.activeNavText]}>
            Classes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('assignments')}
        >
          <MaterialIcons 
            name="assignment" 
            size={24} 
            color={activeTab === 'assignments' ? '#4285F4' : '#9E9E9E'} 
          />
          <Text style={[styles.navText, activeTab === 'assignments' && styles.activeNavText]}>
            Assignments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('profile')}
        >
          <MaterialIcons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? '#4285F4' : '#9E9E9E'} 
          />
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleLight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientHeader: {
    padding: 15,
    flexDirection: 'row',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherNameLight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  teacherDetailLight: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 3,
  },
  quickActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 15,
    marginBottom: 5,
  },
  quickAction: {
    width: width / 4 - 18,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIconGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 15,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  classItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  classTimeContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  classDetails: {
    flex: 1,
    marginLeft: 10,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  classInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  assignmentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  assignmentSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  assignmentDue: {
    fontSize: 14,
    color: '#666',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  submissionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submissionText: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  announcementItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  announcementDate: {
    fontSize: 14,
    color: '#666',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  // Additional styles for other sections...
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 12,
  },
  largeProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  profileNameLight: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileDepartmentLight: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: 110,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  editProfileButton: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  editProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  editIcon: {
    marginRight: 8,
  },
  editProfileText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default TeacherDashboard; 