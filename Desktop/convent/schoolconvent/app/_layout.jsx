import { Stack } from "expo-router";
import { StatusBar, View, Text } from "react-native";
import { useEffect, useState } from 'react';
import databaseStatus from './config/databaseStatus';
import 'react-native-get-random-values';

const RootLayout = () => {
  const [status, setStatus] = useState(databaseStatus.getStatus());

  useEffect(() => {
    // Subscribe to database status changes
    const handleStatusChange = (initialized, error) => {
      setStatus({ initialized, error });
    };

    databaseStatus.addListener(handleStatusChange);

    // Cleanup subscription
    return () => {
      databaseStatus.removeListener(handleStatusChange);
    };
  }, []);

  if (status.error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Database connection failed: {status.error}
        </Text>
      </View>
    );
  }

  if (!status.initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Initializing database...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{headerShown: false}} >
        <Stack.Screen name="index"/>
        <Stack.Screen name="login"/>
        <Stack.Screen name="signup"/>
        <Stack.Screen name="teacherlogin"/>
        <Stack.Screen name="teacherSigup"/>    
        <Stack.Screen name="homestd"/>   
        <Stack.Screen name="attendancemark"/>
        <Stack.Screen name="teacherdashboard"/>
      </Stack>
      <StatusBar backgroundColor="white" style="dark"/>
    </>
  );
};

export default RootLayout;
