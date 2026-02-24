import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const StudentDashboard = () => {
  // Mock data (same as before)
  const studentInfo = {
    name: 'John Doe',
    id: 'STU20240423',
    class: 'Class X-A',
    rollNo: '15',
    attendance: '96%',
    photoUrl: 'https://via.placeholder.com/150', // Using a placeholder image URL
  };
 
  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', time: '10:30 AM - 11:30 AM', teacher: 'Mrs. Johnson', room: 'Room 101', color: '#4285F4' },
    { id: 2, subject: 'Science', time: '12:00 PM - 1:00 PM', teacher: 'Mr. Garcia', room: 'Lab 3', color: '#0F9D58' },
    { id: 3, subject: 'English', time: '2:15 PM - 3:15 PM', teacher: 'Ms. Taylor', room: 'Room 205', color: '#DB4437' },
  ];

  const assignments = [
    { id: 1, subject: 'Science', title: 'Lab Report: Plant Growth', dueDate: '25 Apr', status: 'Pending' },
    { id: 2, subject: 'Mathematics', title: 'Problem Set 7', dueDate: '26 Apr', status: 'Submitted' },
    { id: 3, subject: 'History', title: 'Essay: Industrial Revolution', dueDate: '28 Apr', status: 'Pending' },
    { id: 4, subject: 'English', title: 'Book Review', dueDate: '30 Apr', status: 'Not Started' },
  ];

  const announcements = [
    { id: 1, title: 'School Assembly', message: 'All students must attend the assembly tomorrow at 9:00 AM', date: '22 Apr' },
    { id: 2, title: 'Annual Sports Day', message: 'Annual Sports Day will be held next Friday. Register for events by Wednesday.', date: '20 Apr' },
  ];

  const performanceData = [
    { subject: 'Mathematics', score: 85, color: '#4285F4' },
    { subject: 'Science', score: 92, color: '#0F9D58' },
    { subject: 'English', score: 78, color: '#DB4437' },
    { subject: 'History', score: 88, color: '#F4B400' },
    { subject: 'Computer Science', score: 95, color: '#7E57C2' },
  ];

  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  // Animation values
  const [cardAnimation] = useState(new Animated.Value(0));

  // Animate cards on tab change
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

  // Function to render different tabs
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
      {/* Student Summary Card */}
      <Animated.View style={[
        styles.summaryCard,
        {
          opacity: cardAnimation,
          transform: [{ translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}>
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.gradientHeader}
        >
          <Image 
            source={{ uri: studentInfo.photoUrl }} 
            style={styles.profileImage} 
            // defaultSource={require('@/assets/images/profile-placeholder.png')}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentNameLight}>{studentInfo.name}</Text>
            <Text style={styles.studentDetailLight}>ID: {studentInfo.id}</Text>
            <Text style={styles.studentDetailLight}>{studentInfo.class} | Roll No: {studentInfo.rollNo}</Text>
          </View>
        </LinearGradient>
        <View style={styles.attendanceSummary}>
          <Text style={styles.attendanceLabel}>Attendance:</Text>
          <View style={styles.attendanceBarContainer}>
            <View style={styles.attendanceBar}>
              <View style={[styles.attendanceFill, { width: studentInfo.attendance }]} />
            </View>
            <Text style={styles.attendancePercentage}>{studentInfo.attendance}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.quickActionContainer}>
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="assignment" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Assignments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="schedule" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Timetable</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="assessment" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#9C27B0', '#7B1FA2']}
            style={styles.actionIconGradient}
          >
            <MaterialIcons name="notifications" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Notices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#9C27B0', '#7B1FA2']}
            style={styles.actionIconGradient}
          >
            {/* <FontAwesomeIcon icon="fa-solid fa-clipboard-user" /> */}
            <MaterialIcons name="assistant" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Attendance</Text>

        </TouchableOpacity>
      </View>

      {/* Today's Classes */}
      <Animated.View style={[
        styles.sectionContainer,
        {
          opacity: cardAnimation,
          transform: [{ translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <TouchableOpacity onPress={() => setActiveTab('classes')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingClasses.map(classItem => (
          <View key={classItem.id} style={styles.classItemEnhanced}>
            <View style={[styles.classIndicator, { backgroundColor: classItem.color }]} />
            <View style={styles.classTimeContainer}>
              <Text style={styles.classTime}>{classItem.time.split(' - ')[0]}</Text>
              <View style={styles.timeLine} />
            </View>
            
            <View style={styles.classDetails}>
              <Text style={styles.classSubject}>{classItem.subject}</Text>
              <View style={styles.classInfoRow}>
                <MaterialIcons name="person" size={14} color="#666" />
                <Text style={styles.classTeacher}>{classItem.teacher}</Text>
              </View>
              <View style={styles.classInfoRow}>
                <MaterialIcons name="room" size={14} color="#666" />
                <Text style={styles.classRoom}>{classItem.room}</Text>
              </View>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Upcoming Assignments */}
      <Animated.View style={[
        styles.sectionContainer,
        {
          opacity: cardAnimation,
          transform: [{ translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }
      ]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          <TouchableOpacity onPress={() => setActiveTab('assignments')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {assignments.slice(0, 2).map(assignment => (
          <View key={assignment.id} style={styles.assignmentItemEnhanced}>
            <View style={[styles.assignmentStatus, 
              { backgroundColor: assignment.status === 'Submitted' ? '#E8F5E9' : 
                                assignment.status === 'Pending' ? '#FFF3E0' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, 
                { color: assignment.status === 'Submitted' ? '#2E7D32' : 
                          assignment.status === 'Pending' ? '#E65100' : '#C62828' }]}>
                {assignment.status}
              </Text>
            </View>
            
            <View style={styles.assignmentDetails}>
              <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <View style={styles.assignmentDueRow}>
                <MaterialIcons name="event" size={14} color="#666" />
                <Text style={styles.assignmentDue}>Due: {assignment.dueDate}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewButtonEnhanced}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.View>

      {/* Performance Overview */}
      <Animated.View style={[
        styles.sectionContainer,
        {
          opacity: cardAnimation,
          transform: [{ translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
          })}]
        }
      ]}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        
        <View style={styles.performanceContainer}>
          {performanceData.map((subject, index) => (
            <View key={index} style={styles.performanceItem}>
              <Text style={styles.subjectName}>{subject.subject}</Text>
              <View style={styles.scoreBarContainer}>
                <LinearGradient
                  colors={[subject.color, subject.color + '99']}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={[styles.scoreBar, { width: `${subject.score}%` }]} 
                />
              </View>
              <Text style={[styles.scoreText, {color: subject.color}]}>{subject.score}%</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Announcements */}
      <Animated.View style={[
        styles.sectionContainer,
        {
          opacity: cardAnimation,
          transform: [{ translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}]
        }
      ]}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        
        {announcements.map(announcement => (
          <View key={announcement.id} style={styles.announcementItemEnhanced}>
            <View style={styles.announcementHeader}>
              <View style={styles.announcementTitleContainer}>
                <MaterialIcons name="announcement" size={18} color="#4285F4" style={styles.announcementIcon} />
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
              </View>
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
        <View style={styles.daySelectorEnhanced}>
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
        
        {/* Full class list */}
        {[...upcomingClasses, 
          { id: 4, subject: 'History', time: '3:30 PM - 4:30 PM', teacher: 'Mr. Adams', room: 'Room 103', color: '#F4B400' },
          { id: 5, subject: 'Physical Education', time: '4:45 PM - 5:45 PM', teacher: 'Coach Wilson', room: 'Gymnasium', color: '#7E57C2' }
        ].map(classItem => (
          <Animated.View 
            key={classItem.id} 
            style={[
              styles.fullClassItemEnhanced,
              {
                opacity: cardAnimation,
                transform: [{ translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }
            ]}
          >
            <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
            <View style={styles.classTimeBoxEnhanced}>
              <Text style={styles.classTimeText}>{classItem.time.split(' - ')[0]}</Text>
              <Text style={styles.classTimeSmall}>to</Text>
              <Text style={styles.classTimeText}>{classItem.time.split(' - ')[1]}</Text>
            </View>
            
            <View style={styles.fullClassDetails}>
              <Text style={styles.fullClassSubject}>{classItem.subject}</Text>
              <View style={styles.classInfoRow}>
                <MaterialIcons name="person" size={16} color="#666" />
                <Text style={styles.classInfoText}>{classItem.teacher}</Text>
              </View>
              <View style={styles.classInfoRow}>
                <MaterialIcons name="room" size={16} color="#666" />
                <Text style={styles.classInfoText}>{classItem.room}</Text>
              </View>
            </View>
          </Animated.View>
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
        <View style={styles.assignmentFilterEnhanced}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
            <Text style={styles.activeFilterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Submitted</Text>
          </TouchableOpacity>
        </View>
        {/* Full assignments list */}
        {assignments.map((assignment, index) => (
          <Animated.View 
            key={assignment.id} 
            style={[
              styles.fullAssignmentItemEnhanced,
              {
                opacity: cardAnimation,
                transform: [{ translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [(index + 1) * 10, 0]
                })}]
              }
            ]}
          >
            <View style={styles.assignmentHeader}>
              <View style={styles.subjectLabelEnhanced}>
                <Text style={styles.subjectLabelText}>{assignment.subject}</Text>
              </View>
              <View style={[styles.statusBadge, 
                { backgroundColor: assignment.status === 'Submitted' ? '#E8F5E9' : 
                                  assignment.status === 'Pending' ? '#FFF3E0' : '#FFEBEE' }]}>
                <Text style={[styles.statusBadgeText, 
                  { color: assignment.status === 'Submitted' ? '#2E7D32' : 
                            assignment.status === 'Pending' ? '#E65100' : '#C62828' }]}>
                  {assignment.status}
                </Text>
              </View>
            </View>
            
            <Text style={styles.fullAssignmentTitle}>{assignment.title}</Text>
            
            <View style={styles.assignmentFooter}>
              <View style={styles.dueDateContainer}>
                <MaterialIcons name="event" size={16} color="#666" />
                <Text style={styles.dueText}>Due: {assignment.dueDate}</Text>
              </View>
              
              <TouchableOpacity style={styles.detailButtonEnhanced}>
                <LinearGradient
                  colors={['#4CAF50', '#388E3C']}
                  style={styles.detailButtonGradient}
                >
                  <Text style={styles.detailButtonText}>View Details</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );

  // Profile tab content
  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.profileHeaderEnhanced}
      >
        <Image source={studentInfo.photoUrl} style={styles.largeProfileImage} />
        <Text style={styles.profileNameLight}>{studentInfo.name}</Text>
        <Text style={styles.profileClassLight}>{studentInfo.class}</Text>
      </LinearGradient>
      
      <Animated.View 
        style={[
          styles.sectionContainerProfile,
          {
            opacity: cardAnimation,
            transform: [{ translateY: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}]
          }
        ]}
      >
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="person" size={20} color="#4285F4" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Student ID</Text>
          <Text style={styles.infoValue}>{studentInfo.id}</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Roll Number</Text>
          <Text style={styles.infoValue}>{studentInfo.rollNo}</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>15 July 2005</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>Male</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Blood Group</Text>
          <Text style={styles.infoValue}>B+</Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.sectionContainerProfile,
          {
            opacity: cardAnimation,
            transform: [{ translateY: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })}]
          }
        ]}
      >
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="contact-phone" size={20} color="#0F9D58" />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>john.doe@student.edu</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>(555) 123-4567</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>123 Education Street, Learningville, ED 54321</Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.sectionContainerProfile,
          {
            opacity: cardAnimation,
            transform: [{ translateY: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0]
            })}]
          }
        ]}
      >
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="people" size={20} color="#DB4437" />
          <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Father's Name</Text>
          <Text style={styles.infoValue}>Robert Doe</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Mother's Name</Text>
          <Text style={styles.infoValue}>Sarah Doe</Text>
        </View>
        
        <View style={styles.infoItemEnhanced}>
          <Text style={styles.infoLabel}>Emergency Contact</Text>
          <Text style={styles.infoValue}>(555) 987-6543</Text>
        </View>
      </Animated.View>
      
      <TouchableOpacity style={styles.editProfileButtonEnhanced}>
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
        style={styles.headerEnhanced}
      >
        <View>
          <Text style={styles.headerTitleLight}>Student Dashboard</Text>
          {/* <Text style={styles.headerDateLight}>Wednesday, April 23, 2025</Text> */}
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
      <View style={styles.bottomNavEnhanced}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('dashboard')}
        >
          <MaterialIcons 
            name="dashboard" 
            size={24} 
            color={activeTab === 'dashboard' ? '#4285F4' : '#9E9E9E'} 
          />
          <Text 
            style={[
              styles.navText, 
              activeTab === 'dashboard' && styles.activeNavText
            ]}
          >
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
          <Text 
            style={[
              styles.navText, 
              activeTab === 'classes' && styles.activeNavText
            ]}
          >
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
          <Text 
            style={[
              styles.navText, 
              activeTab === 'assignments' && styles.activeNavText
            ]}
          >
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
          <Text 
            style={[
              styles.navText, 
              activeTab === 'profile' && styles.activeNavText
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    // Enhanced Header
    headerEnhanced: {
      paddingHorizontal: 20,
      paddingVertical: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 4,
    },
    headerTitleLight: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    headerDateLight: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 2,
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
    // Enhanced Summary Card with Gradient
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
    studentInfo: {
      flex: 1,
    },
    studentNameLight: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 4,
    },
    studentDetailLight: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 3,
    },
    attendanceSummary: {
      backgroundColor: 'white',
      padding: 15,
    },
    attendanceLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      marginBottom: 8,
    },
    attendanceBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attendanceBar: {
      flex: 1,
      height: 8,
      backgroundColor: '#e0e0e0',
      borderRadius: 4,
      marginRight: 10,
    },
    attendanceFill: {
      height: 8,
      backgroundColor: '#4CAF50',
      borderRadius: 4,
    },
    attendancePercentage: {
      fontSize: 16,
      color: '#4CAF50',
      fontWeight: '600',
    },
    // Enhanced Quick Actions
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
      // Enhanced Section Container
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
      sectionContainerProfile: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 12,
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
      sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
      },
      viewAllText: {
        fontSize: 14,
        color: '#4285F4',
        fontWeight: '500',
      },
      // Enhanced Class Items
      classItemEnhanced: {
        flexDirection: 'row',
        marginBottom: 18,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      classIndicator: {
        width: 4,
        borderRadius: 2,
        marginRight: 8,
      },
      classTimeContainer: {
        alignItems: 'center',
        width: 60,
      },
      classTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
      },
      timeLine: {
        width: 2,
        height: 40,
        backgroundColor: '#e0e0e0',
        marginTop: 5,
      },
      classDetails: {
        marginLeft: 10,
        flex: 1,
      },
      classInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
      },
      classSubject: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      classTeacher: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
      },
      classRoom: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
      },
      // Enhanced Assignment Items
      assignmentItemEnhanced: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      assignmentStatus: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 12,
      },
      statusText: {
        fontSize: 12,
        fontWeight: '600',
      },
      assignmentDetails: {
        flex: 1,
      },
      assignmentSubject: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
      },
      assignmentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginTop: 3,
        marginBottom: 4,
      },
      assignmentDueRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      assignmentDue: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
      },
      viewButtonEnhanced: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        backgroundColor: '#e8f5e9',
        borderRadius: 20,
        elevation: 1,
      },
      viewButtonText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
      },
      // Enhanced Performance Section
      performanceContainer: {
        marginTop: 8,
      },
      performanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      subjectName: {
        width: 105,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
      },
      scoreBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginRight: 10,
        overflow: 'hidden',
      },
      scoreBar: {
        height: 10,
        borderRadius: 5,
      },
      scoreText: {
        fontSize: 15,
        fontWeight: '600',
        width: 45,
        textAlign: 'right',
      },
      // Enhanced Announcement Items
      announcementItemEnhanced: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      announcementTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      announcementIcon: {
        marginRight: 5,
      },
      announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      announcementDate: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
      },
      announcementMessage: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
      },
      // Enhanced Bottom Navigation
      bottomNavEnhanced: {
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
      // Enhanced Classes Tab
      pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
      },
      daySelectorEnhanced: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        padding: 4,
      },
      dayButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 2,
        borderRadius: 20,
      },
      activeDayButton: {
        backgroundColor: '#4285F4',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      dayText: {
        color: '#666',
        fontWeight: '500',
      },
      activeDayText: {
        color: '#fff',
        fontWeight: '600',
      },
      fullClassItemEnhanced: {
        flexDirection: 'row',
        marginBottom: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
      },
      classColorBar: {
        width: 8,
      },
      classTimeBoxEnhanced: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
      },
      classTimeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
      },
      classTimeSmall: {
        fontSize: 12,
        color: '#666',
        marginVertical: 2,
      },
      fullClassDetails: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
        padding: 12,
      },
      fullClassSubject: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
      },
      classInfoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
      },
      // Enhanced Assignments Tab
      assignmentFilterEnhanced: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        padding: 4,
      },
      filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 2,
        borderRadius: 20,
      },
      activeFilterButton: {
        backgroundColor: '#4285F4',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      filterText: {
        color: '#666',
        fontWeight: '500',
      },
      activeFilterText: {
        color: '#fff',
        fontWeight: '600',
      },
      fullAssignmentItemEnhanced: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
      assignmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      subjectLabelEnhanced: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
      },
      subjectLabelText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
      },
      statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
      },
      statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
      },
      fullAssignmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
      },
      assignmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      dueText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 5,
      },
      detailButtonEnhanced: {
        borderRadius: 20,
        overflow: 'hidden',
      },
      detailButtonGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      detailButtonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '600',
      },
      // Enhanced Profile Tab
      profileHeaderEnhanced: {
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
      profileClassLight: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
      },
      infoItemEnhanced: {
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
      editProfileButtonEnhanced: {
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
  
  export default StudentDashboard;
