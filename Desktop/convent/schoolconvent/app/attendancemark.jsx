import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const AttendanceMark = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attendance, setAttendance] = useState({});

  // Mock data - replace with actual data from your backend
  const classes = ['Class X-A', 'Class X-B', 'Class XI-A', 'Class XI-B', 'Class XII-A', 'Class XII-B'];
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001' },
    { id: 2, name: 'Jane Smith', rollNo: '002' },
    { id: 3, name: 'Mike Johnson', rollNo: '003' },
    { id: 4, name: 'Sarah Williams', rollNo: '004' },
    { id: 5, name: 'David Brown', rollNo: '005' },
    { id: 6, name: 'Emma Wilson', rollNo: '006' },
    { id: 7, name: 'James Taylor', rollNo: '007' },
    { id: 8, name: 'Olivia Martinez', rollNo: '008' },
    { id: 9, name: 'William Anderson', rollNo: '009' },
    { id: 10, name: 'Sophia Thomas', rollNo: '0010' },
    { id: 11, name: 'Benjamin Lee', rollNo: '0011' },
    { id: 12, name: 'Isabella Garcia', rollNo: '0012' },
  ];

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = () => {
    if (!selectedClass || !selectedSubject) {
      Alert.alert('Error', 'Please select both class and subject');
      return;
    }

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalCount = students.length;

    Alert.alert(
      'Confirm Attendance',
      `Total Present: ${presentCount}/${totalCount}\nDo you want to submit?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Submit',
          onPress: () => {
            // Here you would typically make an API call to save attendance
            console.log('Attendance submitted:', {
              date: selectedDate,
              class: selectedClass,
              subject: selectedSubject,
              attendance
            });
            Alert.alert('Success', 'Attendance marked successfully');
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="calendar-today" size={20} color="#666" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Class Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
            {classes.map((className) => (
              <TouchableOpacity
                key={className}
                style={[
                  styles.classButton,
                  selectedClass === className && styles.selectedClassButton
                ]}
                onPress={() => setSelectedClass(className)}
              >
                <Text style={[
                  styles.classButtonText,
                  selectedClass === className && styles.selectedClassButtonText
                ]}>
                  {className}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.subjectButton,
                  selectedSubject === subject && styles.selectedSubjectButton
                ]}
                onPress={() => setSelectedSubject(subject)}
              >
                <Text style={[
                  styles.subjectButtonText,
                  selectedSubject === subject && styles.selectedSubjectButtonText
                ]}>
                  {subject}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Student List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student List</Text>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentItem}
              onPress={() => toggleAttendance(student.id)}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentRoll}>Roll No: {student.rollNo}</Text>
              </View>
              <View style={[
                styles.attendanceMark,
                attendance[student.id] && styles.presentMark
              ]}>
                <MaterialIcons
                  name={attendance[student.id] ? "check-circle" : "radio-button-unchecked"}
                  size={24}
                  color={attendance[student.id] ? "#4CAF50" : "#9E9E9E"}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.submitGradient}
        >
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  classScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  classButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedClassButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  classButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectedClassButtonText: {
    color: 'white',
  },
  subjectScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  subjectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSubjectButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  subjectButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectedSubjectButtonText: {
    color: 'white',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  studentRoll: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  attendanceMark: {
    padding: 5,
  },
  presentMark: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  submitButton: {
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AttendanceMark; 