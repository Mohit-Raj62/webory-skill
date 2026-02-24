import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView, Alert, Image, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

// Custom TextInput component with border label
const BorderLabelInput = ({ label, error, value, onChangeText, onBlur, touched, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.borderLabelContainer}>
      {(isFocused || value) && (
        <Text style={[
          styles.borderLabel, 
          isFocused && styles.focusedBorderLabel,
          touched && error && styles.errorBorderLabel
        ]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input, 
          touched && error && styles.inputError,
          isFocused && styles.inputFocused,
          props.multiline && styles.multilineInput
        ]}
        placeholder={isFocused ? '' : label}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur && onBlur();
        }}
        {...props}
      />
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
      {props.showHelper && <Text style={styles.helperText}>{props.helperText}</Text>}
    </View>
  );
};

const TeacherSignup = () => {
  // Form state
  const [formData, setFormData] = useState({
    teacherName: '',
    subjectName: '',
    qualification: '',
    email: '',
    phone: '',
    experienceYears: '',
    experienceMonths: '',
    experienceDays: '',
    gender: '',
    password: '',
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched({
        ...touched,
        [field]: true
      });
    }
    
    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Handle field blur
  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
    
    // Validate the field on blur
    validateField(field);
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
  
  // Validate individual field
  const validateField = (field) => {
    let newErrors = { ...errors };
    
    switch(field) {
      case 'teacherName':
      case 'subjectName':
      case 'qualification':
      case 'password':
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        } else if (field === 'password' && formData.password.length < 6) {
          newErrors[field] = 'Password must be at least 6 characters';
        } else {
          newErrors[field] = null;
        }
        break;
      case 'email':
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          newErrors.email = null;
        }
        break;
      case 'phone':
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        } else {
          newErrors.phone = null;
        }
        break;
      case 'gender':
        if (!formData.gender) {
          newErrors.gender = 'Please select a gender';
        } else {
          newErrors.gender = null;
        }
        break;
      case 'experienceYears':
      case 'experienceMonths':
      case 'experienceDays':
        // At least one experience field should be filled
        if (!formData.experienceYears && !formData.experienceMonths && !formData.experienceDays) {
          newErrors.experience = 'Please enter your experience';
        } else {
          newErrors.experience = null;
        }
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  };
  
  // Validate form
  const validateForm = () => {
    // Validate all fields at once
    const fields = ['teacherName', 'subjectName', 'qualification', 'email', 'phone', 'gender', 'password'];
    fields.forEach(field => validateField(field));
    
    // Check experience fields
    if (!formData.experienceYears && !formData.experienceMonths && !formData.experienceDays) {
      setErrors(prev => ({ ...prev, experience: 'Please enter your experience' }));
    }
    
    // Mark all fields as touched
    const allTouched = {};
    fields.forEach(field => { allTouched[field] = true; });
    allTouched.experience = true;
    setTouched(allTouched);
    
    // Check if there are any errors
    const hasErrors = fields.some(field => !!errors[field]) || 
                      (!formData.experienceYears && !formData.experienceMonths && !formData.experienceDays);
    
    return !hasErrors;
  };
  
  // Handle signup
  const router = useRouter();
  const onSignup = () => {
    console.log('Form data:', formData);
    
    if (validateForm()) {
      console.log('Form data:', formData);
      Alert.alert('Success', 'Registration submitted successfully!');
      router.navigate("/teacherlogin");
      // Submit form data here
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
        <ImageBackground 
          source={require("@/assets/images/loginSC.png")} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Image 
              source={require("@/assets/images/sclogo.png")} 
              style={styles.logo} 
            />
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Teacher Registration</Text>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Teacher Name *"
                  placeholder="Teacher Name"
                  value={formData.teacherName}
                  onChangeText={(text) => handleChange('teacherName', text)}
                  onBlur={() => handleBlur('teacherName')}
                  error={errors.teacherName}
                  touched={touched.teacherName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Subject Name *"
                  placeholder="Subject Name"
                  value={formData.subjectName}
                  onChangeText={(text) => handleChange('subjectName', text)}
                  onBlur={() => handleBlur('subjectName')}
                  error={errors.subjectName}
                  touched={touched.subjectName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Qualification *"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChangeText={(text) => handleChange('qualification', text)}
                  onBlur={() => handleBlur('qualification')}
                  error={errors.qualification}
                  touched={touched.qualification}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Enter Email *"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Enter Password *"
                  value={formData.password}
                  placeholder="Enter Password"
                  onChangeText={(text) => handleChange('password', text)}
                  onBlur={() => handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                  showHelper={touched.password && !errors.password && formData.password.length >= 6}
                  helperText={`Password strength: ${formData.password.length < 8 ? 'Medium' : 'Strong'}`}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <BorderLabelInput 
                  label="Phone Number *"
                  value={formData.phone}
                  placeholder="Enter Phone Number"
                  onChangeText={(text) => handleChange('phone', text)}
                  onBlur={() => handleBlur('phone')}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              
              <Text style={styles.sectionLabel}>Experience *</Text>
              <View style={styles.dateContainer}>
                <View style={styles.dateInputContainer}>
                  <BorderLabelInput 
                    label="Years"
                    value={formData.experienceYears}
                    onChangeText={(text) => handleChange('experienceYears', text)}
                    onBlur={() => handleBlur('experienceYears')}
                    error={errors.experience}
                    touched={touched.experience}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <Text style={styles.dateSeparator}>-</Text>
                <View style={styles.dateInputContainer}>
                  <BorderLabelInput 
                    label="MM"
                    value={formData.experienceMonths}
                    onChangeText={(text) => handleChange('experienceMonths', text)}
                    onBlur={() => handleBlur('experienceMonths')}
                    error={errors.experience}
                    touched={touched.experience}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <Text style={styles.dateSeparator}>-</Text>
                <View style={styles.dateInputContainer}>
                  <BorderLabelInput 
                    label="Days"
                    value={formData.experienceDays}
                    onChangeText={(text) => handleChange('experienceDays', text)}
                    onBlur={() => handleBlur('experienceDays')}
                    error={errors.experience}
                    touched={touched.experience}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.sectionLabel}>Gender *</Text>
                <View style={styles.radioGroup}>
                  <RadioButton 
                    selected={formData.gender === 'Male'} 
                    onPress={() => { 
                      handleChange('gender', 'Male');
                      handleBlur('gender');
                    }}
                    label="Male"
                  />
                  <RadioButton 
                    selected={formData.gender === 'Female'} 
                    onPress={() => {
                      handleChange('gender', 'Female');
                      handleBlur('gender');
                    }}
                    label="Female"
                  />
                  <RadioButton 
                    selected={formData.gender === 'Other'} 
                    onPress={() => {
                      handleChange('gender', 'Other');
                      handleBlur('gender');
                    }}
                    label="Other"
                  />
                </View>
                {touched.gender && errors.gender && 
                  <Text style={styles.errorText}>{errors.gender}</Text>
                }
              </View>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={onSignup}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: width > 600 ? 30 : 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2e7d32',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    paddingBottom: 10,
    width: '80%',
  },
  formContainer: {
    width: width > 600 ? '80%' : '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: width > 600 ? 30 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
  },
  // Border label input styles
  borderLabelContainer: {
    position: 'relative',
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
    fontSize: 16,
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
    color: '#e53935',
  },
  multilineInput: {
    height: 80,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e53935',
    borderWidth: 1.5,
    backgroundColor: '#ffebee',
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 3,
    marginLeft: 5,
  },
  helperText: {
    color: '#43a047',
    fontSize: 12,
    marginTop: 3,
    marginLeft: 5,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 8,
    color: '#424242',
    fontWeight: '500',
    fontSize: 16,
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
  dateInput: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
    fontSize: 11,
  },
  dateSeparator: {
    fontSize: 20,
    marginHorizontal: 8,
    color: '#555',
    fontWeight: '500',
  },
  dateErrorText: {
    color: '#e53935',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  radioOuter: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '90%',
    height: 55,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

export default TeacherSignup;