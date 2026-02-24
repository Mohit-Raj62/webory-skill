import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/styles';

const Login = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      <Button
        mode="text"
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkButton}
      >
        Don't have an account? Sign Up
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('AdminSignup')}
        style={styles.linkButton}
      >
        Admin Sign Up
      </Button>
    </View>
  );
};

export default Login; 