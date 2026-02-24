import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Student Screens
import StudentDashboard from '../screens/student/Dashboard';
import StudentGrades from '../screens/student/StudentGrades';
import StudentAssignments from '../screens/student/StudentAssignments';
import StudentSchedule from '../screens/student/StudentSchedule';
import StudentPayments from '../screens/student/StudentPayments';
import StudentAttendance from '../screens/student/StudentAttendance';

// Teacher Screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import TeacherClasses from '../screens/teacher/TeacherClasses';
import TeacherStudents from '../screens/teacher/TeacherStudents';
import TeacherAssignments from '../screens/teacher/TeacherAssignments';
import TeacherGrades from '../screens/teacher/TeacherGrades';
import TeacherAttendance from '../screens/teacher/TeacherAttendance';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminUsers from '../screens/admin/AdminUsers';
import AdminReports from '../screens/admin/AdminReports';
import AdminSettings from '../screens/admin/AdminSettings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#6200ee" />
  </View>
);

// Placeholder components for screens that don't exist yet
const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#6200ee" />
  </View>
);

const StudentTabs = () => {
  const insets = useSafeAreaInsets();
  console.log('StudentTabs: Rendering student tabs');
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: insets.bottom,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Grades"
        component={StudentGrades}
        options={{
          tabBarLabel: 'Grades',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="grade" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={StudentAssignments}
        options={{
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={StudentSchedule}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="schedule" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={StudentPayments}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="payment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={StudentAttendance}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-available" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const TeacherTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={TeacherDashboard || PlaceholderScreen} />
    <Tab.Screen name="Classes" component={TeacherClasses || PlaceholderScreen} />
    <Tab.Screen name="Students" component={TeacherStudents || PlaceholderScreen} />
    <Tab.Screen name="Assignments" component={TeacherAssignments || PlaceholderScreen} />
    <Tab.Screen name="Grades" component={TeacherGrades || PlaceholderScreen} />
    <Tab.Screen name="Attendance" component={TeacherAttendance || PlaceholderScreen} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={AdminDashboard || PlaceholderScreen} />
    <Tab.Screen name="Users" component={AdminUsers || PlaceholderScreen} />
    <Tab.Screen name="Reports" component={AdminReports || PlaceholderScreen} />
    <Tab.Screen name="Settings" component={AdminSettings || PlaceholderScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  console.log('AppNavigator: Current user state:', user);
  console.log('AppNavigator: Loading state:', isLoading);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // App Stack
          <Stack.Screen name="MainApp" component={StudentTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 