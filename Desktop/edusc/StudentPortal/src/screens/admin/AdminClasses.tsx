import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  FAB,
  Portal,
  Dialog,
  TextInput,
  List,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../../config';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  description: string;
  teacher: {
    _id: string;
    name: string;
  };
  students: {
    _id: string;
    name: string;
  }[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    status: 'active',
  });

  const fetchClasses = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.ADMIN.CLASSES), {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setFormData({
      name: '',
      description: '',
      teacher: '',
      status: 'active',
    });
    setDialogVisible(true);
  };

  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description,
      teacher: classItem.teacher._id,
      status: classItem.status,
    });
    setDialogVisible(true);
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await axios.delete(`${getApiUrl(API_ENDPOINTS.ADMIN.CLASSES)}/${classId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedClass) {
        await axios.put(
          `${getApiUrl(API_ENDPOINTS.ADMIN.CLASSES)}/${selectedClass._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        await axios.post(getApiUrl(API_ENDPOINTS.ADMIN.CLASSES), formData, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
      setDialogVisible(false);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search classes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredClasses.map((classItem) => (
          <Card key={classItem._id} style={styles.classCard}>
            <Card.Content>
              <View style={styles.classHeader}>
                <View>
                  <Title>{classItem.name}</Title>
                  <Paragraph>{classItem.description}</Paragraph>
                </View>
                <View style={styles.classActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEditClass(classItem)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDeleteClass(classItem._id)}
                  />
                </View>
              </View>

              <View style={styles.classDetails}>
                <Text style={styles.teacherName}>
                  Teacher: {classItem.teacher.name}
                </Text>
                <Text style={styles.studentCount}>
                  Students: {classItem.students.length}
                </Text>
                <View style={styles.scheduleContainer}>
                  {classItem.schedule.map((slot, index) => (
                    <Chip key={index} style={styles.scheduleChip}>
                      {slot.day} {slot.startTime}-{slot.endTime}
                    </Chip>
                  ))}
                </View>
                <Text style={styles.classStatus}>
                  Status: {classItem.status}
                </Text>
                <Text style={styles.classDate}>
                  Created: {new Date(classItem.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {selectedClass ? 'Edit Class' : 'Add New Class'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Class Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              style={styles.input}
              multiline
            />
            <List.Item
              title="Teacher"
              description={formData.teacher}
              onPress={() => {
                // Show teacher selection dialog
              }}
            />
            <List.Item
              title="Status"
              description={formData.status}
              onPress={() => {
                // Show status selection dialog
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSubmit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddClass}
        label="Add Class"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  classCard: {
    margin: 10,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classActions: {
    flexDirection: 'row',
  },
  classDetails: {
    marginTop: 10,
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
  },
  studentCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  scheduleChip: {
    margin: 4,
  },
  classStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  classDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0066cc',
  },
  input: {
    marginBottom: 10,
  },
});

export default AdminClasses; 