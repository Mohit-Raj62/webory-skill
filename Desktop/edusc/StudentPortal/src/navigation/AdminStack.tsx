import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminUsers from '../screens/admin/AdminUsers';
import AdminClasses from '../screens/admin/AdminClasses';
import AdminSettings from '../screens/admin/AdminSettings';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminClasses: undefined;
  AdminSettings: undefined;
};

const Stack = createStackNavigator<AdminStackParamList>();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0066cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsers}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name="AdminClasses"
        component={AdminClasses}
        options={{ title: 'Manage Classes' }}
      />
      <Stack.Screen
        name="AdminSettings"
        component={AdminSettings}
        options={{ title: 'System Settings' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack; 