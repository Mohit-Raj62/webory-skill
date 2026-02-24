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
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../../config';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    status: 'active',
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.ADMIN.USERS), {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'student',
      status: 'active',
    });
    setDialogVisible(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setDialogVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`${getApiUrl(API_ENDPOINTS.ADMIN.USERS)}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        await axios.put(
          `${getApiUrl(API_ENDPOINTS.ADMIN.USERS)}/${selectedUser._id}`,
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
        await axios.post(getApiUrl(API_ENDPOINTS.ADMIN.USERS), formData, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
      setDialogVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.map((user) => (
          <Card key={user._id} style={styles.userCard}>
            <Card.Content>
              <View style={styles.userHeader}>
                <View>
                  <Title>{user.name}</Title>
                  <Paragraph>{user.email}</Paragraph>
                </View>
                <View style={styles.userActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEditUser(user)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDeleteUser(user._id)}
                  />
                </View>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userRole}>Role: {user.role}</Text>
                <Text style={styles.userStatus}>Status: {user.status}</Text>
                <Text style={styles.userDate}>
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
            />
            <List.Item
              title="Role"
              description={formData.role}
              onPress={() => {
                // Show role selection dialog
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
        onPress={handleAddUser}
        label="Add User"
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
  userCard: {
    margin: 10,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userActions: {
    flexDirection: 'row',
  },
  userDetails: {
    marginTop: 10,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  userStatus: {
    fontSize: 14,
    color: '#666',
  },
  userDate: {
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

export default AdminUsers; 