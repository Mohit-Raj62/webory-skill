import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView, Alert, Platform, Image, useRouter } from 'react-native';
import AuthService from './services/authService';

const { width } = Dimensions.get('window');

// Custom TextInput component with border label
const BorderLabelInput = ({ label, error, value, onChangeText, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.borderLabelContainer}>
      {(isFocused || value) && (
        <Text style={[
          styles.borderLabel, 
          isFocused && styles.focusedBorderLabel,
          error && styles.errorBorderLabel
        ]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input, 
          error && styles.inputError,
          isFocused && styles.inputFocused,
          props.multiline && styles.multilineInput
        ]}
        placeholder={isFocused ? '' : label}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const StudentSignup = () => {
  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    email: '',
    phone: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    studentId: 'STU20240423',
    rollNo: '',
    address: '',
    password: '',
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const authService = new AuthService();
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Validate phone
  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };
  
  // Validate date
  const validateDate = () => {
    const { birthDay, birthMonth, birthYear } = formData;
    
    if (!birthDay || !birthMonth || !birthYear) {
      return 'All date fields are required';
    }
    
    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    
    if (isNaN(day) || day < 1 || day > 31) {
      return 'Invalid day';
    }
    
    if (isNaN(month) || month < 1 || month > 12) {
      return 'Invalid month';
    }
    
    if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
      return 'Invalid year';
    }
    
    // Check valid date (e.g., no February 30)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return 'Invalid date combination';
    }
    return null;
  };
  
  // Validate form
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    // Check required fields
    Object.keys(formData).forEach(key => {
      // Skip date validation here as we'll handle it separately
      if (key === 'birthDay' || key === 'birthMonth' || key === 'birthYear') return;
      if (!formData[key]) {
        tempErrors[key] = 'This field is required';
        isValid = false;
      }
    });
    // Validate email
    if (formData.email && !validateEmail(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    // Validate phone
    if (formData.phone && !validatePhone(formData.phone)) {
      tempErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    // Validate date
    const dateError = validateDate();
    if (dateError) {
      tempErrors.birthDate = dateError;
      isValid = false;
    }
    // Validate password length
    if (formData.password && formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };
  
  // Handle signup
  const onSignup = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Create user in database
        const userData = {
          email: formData.email,
          password: formData.password,
          role: 'student', // Default role for signup
          status: 'active'
        };
        
        const user = await authService.register(userData);
        
        if (user) {
          // Create student profile
          const studentData = {
            authId: user._id,
            name: formData.studentName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            dateOfBirth: new Date(
              parseInt(formData.birthYear),
              parseInt(formData.birthMonth) - 1,
              parseInt(formData.birthDay)
            ),
            status: 'active'
          };
          
          // You'll need to implement this method in your service
          await authService.createStudentProfile(studentData);
          
          Alert.alert('Success', 'Registration completed successfully!');
          router.navigate("/login");
        }
      } catch (error) {
        Alert.alert('Registration Failed', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields correctly.');
    }
  };
  
  // Radio button for gender
  const RadioButton = ({ selected, onPress, label }) => {
    return (
      <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
        <View style={styles.radioOuter}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image 
            source={require("@/assets/images/sclogo.png")}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
              resizeMode: "cover",
              marginTop: 20
            }} 
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Student Registration</Text>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Student Name *"
                value={formData.studentName}
                onChangeText={(text) => handleChange('studentName', text)}
                error={errors.studentName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Father Name *"
                value={formData.fatherName}
                onChangeText={(text) => handleChange('fatherName', text)}
                error={errors.fatherName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Mother Name *"
                value={formData.motherName}
                onChangeText={(text) => handleChange('motherName', text)}
                error={errors.motherName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Enter Email *"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Phone Number *"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                error={errors.phone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            <Text style={styles.dateLabel}>Birth Date *</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateInputContainer}>
                <BorderLabelInput
                  label="DD"
                  value={formData.birthDay}
                  onChangeText={(text) => handleChange('birthDay', text)}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={styles.dateInputContainer}>
                <BorderLabelInput
                  label="MM"
                  value={formData.birthMonth}
                  onChangeText={(text) => handleChange('birthMonth', text)}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={styles.dateInputContainer}>
                <BorderLabelInput
                  label="YYYY"
                  value={formData.birthYear}
                  onChangeText={(text) => handleChange('birthYear', text)}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>
            {errors.birthDate && <Text style={styles.dateErrorText}>{errors.birthDate}</Text>}
            
            <View style={styles.inputContainer}>
              <Text style={styles.genderLabel}>Gender *</Text>
              <View style={styles.radioGroup}>
                <RadioButton 
                  selected={formData.gender === 'Male'} 
                  onPress={() => handleChange('gender', 'Male')}
                  label="Male"
                />
                <RadioButton 
                  selected={formData.gender === 'Female'} 
                  onPress={() => handleChange('gender', 'Female')}
                  label="Female"
                />
                <RadioButton 
                  selected={formData.gender === 'Other'} 
                  onPress={() => handleChange('gender', 'Other')}
                  label="Other"
                />
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Student ID *"
                value={formData.studentId}
                onChangeText={(text) => handleChange('studentId', text)}
                error={errors.studentId}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Enter Your Roll-No *"
                value={formData.rollNo}
                onChangeText={(text) => handleChange('rollNo', text)}
                error={errors.rollNo}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Enter Address *"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                error={errors.address}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <BorderLabelInput
                label="Enter Password *"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                error={errors.password}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={onSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: width > 600 ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    paddingBottom: 10,
    width: '80%',
  },
  formContainer: {
    width: width > 600 ? '80%' : '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: width > 600 ? 30 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
  },
  // Border label input styles
  borderLabelContainer: {
    position: 'relative',
    marginBottom: 5,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingTop: 12,
  },
  borderLabel: {
    position: 'absolute',
    left: 10,
    top: -10,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#666',
    zIndex: 1,
  },
  focusedBorderLabel: {
    color: '#4CAF50',
  },
  errorBorderLabel: {
    color: '#ff6b6b',
  },
  multilineInput: {
    height: 80,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginLeft: 5,
    marginTop: 2,
  },
  dateLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  genderLabel: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  dateContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateSeparator: {
    fontSize: 24,
    marginHorizontal: 5,
    color: '#666',
  },
  dateErrorText: {
    color: '#ff6b6b',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default StudentSignup;