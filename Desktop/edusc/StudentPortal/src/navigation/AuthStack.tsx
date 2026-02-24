import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import Signup from '../screens/auth/Signup';
import AdminSignup from '../screens/auth/AdminSignup';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  AdminSignup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
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
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name="AdminSignup"
        component={AdminSignup}
        options={{ title: 'Admin Sign Up' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack; 