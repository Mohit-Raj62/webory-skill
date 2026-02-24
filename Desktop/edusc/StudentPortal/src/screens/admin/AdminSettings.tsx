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
  Switch,
  Button,
  TextInput,
  List,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../../config';
import axios from 'axios';

interface SystemSettings {
  _id: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxStudentsPerClass: number;
  defaultPasswordExpiry: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  backupFrequency: string;
  lastBackup: string;
  updatedAt: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    maxStudentsPerClass: 30,
    defaultPasswordExpiry: 90,
    emailNotifications: true,
    smsNotifications: false,
    backupFrequency: 'daily',
  });

  const fetchSettings = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.ADMIN.SETTINGS), {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setSettings(response.data);
        setFormData({
          maintenanceMode: response.data.maintenanceMode,
          registrationEnabled: response.data.registrationEnabled,
          maxStudentsPerClass: response.data.maxStudentsPerClass,
          defaultPasswordExpiry: response.data.defaultPasswordExpiry,
          emailNotifications: response.data.emailNotifications,
          smsNotifications: response.data.smsNotifications,
          backupFrequency: response.data.backupFrequency,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettings();
  };

  const handleSave = async () => {
    try {
      await axios.put(
        getApiUrl(API_ENDPOINTS.ADMIN.SETTINGS),
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      setEditing(false);
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleBackup = async () => {
    try {
      await axios.post(
        `${getApiUrl(API_ENDPOINTS.ADMIN.SETTINGS)}/backup`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      fetchSettings();
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>System Settings</Title>
          <List.Section>
            <List.Item
              title="Maintenance Mode"
              description="Enable maintenance mode to restrict access"
              right={() => (
                <Switch
                  value={editing ? formData.maintenanceMode : settings?.maintenanceMode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, maintenanceMode: value })
                  }
                  disabled={!editing}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Registration"
              description="Allow new user registrations"
              right={() => (
                <Switch
                  value={editing ? formData.registrationEnabled : settings?.registrationEnabled}
                  onValueChange={(value) =>
                    setFormData({ ...formData, registrationEnabled: value })
                  }
                  disabled={!editing}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Max Students Per Class"
              description="Maximum number of students allowed in a class"
              right={() =>
                editing ? (
                  <TextInput
                    value={formData.maxStudentsPerClass.toString()}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        maxStudentsPerClass: parseInt(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                    style={styles.numberInput}
                  />
                ) : (
                  <Text>{settings?.maxStudentsPerClass}</Text>
                )
              }
            />
            <Divider />
            <List.Item
              title="Password Expiry (days)"
              description="Number of days before passwords expire"
              right={() =>
                editing ? (
                  <TextInput
                    value={formData.defaultPasswordExpiry.toString()}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        defaultPasswordExpiry: parseInt(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                    style={styles.numberInput}
                  />
                ) : (
                  <Text>{settings?.defaultPasswordExpiry}</Text>
                )
              }
            />
            <Divider />
            <List.Item
              title="Email Notifications"
              description="Enable system email notifications"
              right={() => (
                <Switch
                  value={editing ? formData.emailNotifications : settings?.emailNotifications}
                  onValueChange={(value) =>
                    setFormData({ ...formData, emailNotifications: value })
                  }
                  disabled={!editing}
                />
              )}
            />
            <Divider />
            <List.Item
              title="SMS Notifications"
              description="Enable system SMS notifications"
              right={() => (
                <Switch
                  value={editing ? formData.smsNotifications : settings?.smsNotifications}
                  onValueChange={(value) =>
                    setFormData({ ...formData, smsNotifications: value })
                  }
                  disabled={!editing}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Backup Frequency"
              description="How often to create system backups"
              right={() =>
                editing ? (
                  <TextInput
                    value={formData.backupFrequency}
                    onChangeText={(text) =>
                      setFormData({ ...formData, backupFrequency: text })
                    }
                    style={styles.textInput}
                  />
                ) : (
                  <Text>{settings?.backupFrequency}</Text>
                )
              }
            />
            <Divider />
            <List.Item
              title="Last Backup"
              description="When the last system backup was created"
              right={() => (
                <Text>
                  {settings?.lastBackup
                    ? new Date(settings.lastBackup).toLocaleString()
                    : 'Never'}
                </Text>
              )}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {editing ? (
          <>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
            >
              Save Changes
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setEditing(false);
                setFormData({
                  maintenanceMode: settings?.maintenanceMode || false,
                  registrationEnabled: settings?.registrationEnabled || true,
                  maxStudentsPerClass: settings?.maxStudentsPerClass || 30,
                  defaultPasswordExpiry: settings?.defaultPasswordExpiry || 90,
                  emailNotifications: settings?.emailNotifications || true,
                  smsNotifications: settings?.smsNotifications || false,
                  backupFrequency: settings?.backupFrequency || 'daily',
                });
              }}
              style={styles.button}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={() => setEditing(true)}
            style={styles.button}
          >
            Edit Settings
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={handleBackup}
          style={styles.button}
        >
          Create Backup
        </Button>
      </View>
    </ScrollView>
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
  card: {
    margin: 10,
    elevation: 2,
  },
  numberInput: {
    width: 60,
    textAlign: 'center',
  },
  textInput: {
    width: 100,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    minWidth: 120,
  },
});

export default AdminSettings; 