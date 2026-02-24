import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, StatusBar, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const Techlogin = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: ''
  });
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  const onLogin = () => {
    // Basic validation
    if (!formData.name || !formData.userId || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    // Here you would typically make an API call to verify credentials
    // For now, we'll just simulate a successful login
    console.log('Login with:', formData);
    
    // Navigate to teacher dashboard
    router.replace('/teacherdashboard');
  };
  const router = useRouter();
  const onSignup = () => {
    router.navigate("teacherSigup")
    // router singnup logic here
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("@/assets/images/loginSC.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.overlay}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Teacher - Log-In</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder='Enter Name'
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder='Enter User ID'
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={formData.userId}
                  onChangeText={(text) => handleChange('userId', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder='Enter Password'
                  placeholderTextColor="#888"
                  style={styles.input}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                />
              </View>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={onLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={onSignup}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
              <View style={styles.forgotPassword}>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};
// Css For The login Screen Styles logic
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  signupButton: {
    width: '100%',
    height: 55,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  signupButtonText: {
    color: '#4CAF50',
    fontSize: 17,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});

export default Techlogin;