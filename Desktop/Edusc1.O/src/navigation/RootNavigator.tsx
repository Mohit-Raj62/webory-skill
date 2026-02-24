import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Student Stack
const StudentStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
  </Stack.Navigator>
);

// Teacher Stack
const TeacherStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
  </Stack.Navigator>
);

// Admin Stack
const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
  </Stack.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  // TODO: Replace with actual auth state
  const isAuthenticated = false;
  const userRole = 'student'; // This should come from your auth state

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userRole === 'student' && (
            <Stack.Screen name="StudentStack" component={StudentStack} />
          )}
          {userRole === 'teacher' && (
            <Stack.Screen name="TeacherStack" component={TeacherStack} />
          )}
          {userRole === 'admin' && (
            <Stack.Screen name="AdminStack" component={AdminStack} />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator; 