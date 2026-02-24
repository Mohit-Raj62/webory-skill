import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';

interface Report {
  _id: string;
  type: 'attendance' | 'grades' | 'revenue' | 'enrollment';
  title: string;
  description: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
}

const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReportTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'attendance':
        return '#28a745';
      case 'grades':
        return '#0066cc';
      case 'revenue':
        return '#ffc107';
      case 'enrollment':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'generating':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const handleGenerateReport = async (type: Report['type']) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          period: dateRange,
        }),
      });

      if (response.ok) {
        fetchReports();
        Alert.alert('Success', 'Report generation started');
      } else {
        Alert.alert('Error', 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        Alert.alert('Error', 'Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      Alert.alert('Error', 'Failed to download report');
    }
  };

  const filteredReports = reports.filter(report => 
    !selectedType || report.type === selectedType
  );

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
      <Text style={styles.title}>Reports</Text>

      <View style={styles.dateRangeContainer}>
        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.dateInputs}>
          <TextInput
            style={styles.dateInput}
            placeholder="Start Date (YYYY-MM-DD)"
            value={dateRange.start}
            onChangeText={(text) => setDateRange(prev => ({ ...prev, start: text }))}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="End Date (YYYY-MM-DD)"
            value={dateRange.end}
            onChangeText={(text) => setDateRange(prev => ({ ...prev, end: text }))}
          />
        </View>
      </View>

      <View style={styles.reportTypesContainer}>
        <Text style={styles.sectionTitle}>Generate Report</Text>
        <View style={styles.reportTypes}>
          <TouchableOpacity
            style={[styles.reportTypeButton, { backgroundColor: getReportTypeColor('attendance') }]}
            onPress={() => handleGenerateReport('attendance')}
          >
            <Text style={styles.reportTypeText}>Attendance Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportTypeButton, { backgroundColor: getReportTypeColor('grades') }]}
            onPress={() => handleGenerateReport('grades')}
          >
            <Text style={styles.reportTypeText}>Grades Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportTypeButton, { backgroundColor: getReportTypeColor('revenue') }]}
            onPress={() => handleGenerateReport('revenue')}
          >
            <Text style={styles.reportTypeText}>Revenue Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportTypeButton, { backgroundColor: getReportTypeColor('enrollment') }]}
            onPress={() => handleGenerateReport('enrollment')}
          >
            <Text style={styles.reportTypeText}>Enrollment Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedType && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[
              styles.filterButtonText,
              !selectedType && styles.filterButtonTextActive,
            ]}>All Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === 'attendance' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('attendance')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === 'attendance' && styles.filterButtonTextActive,
            ]}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === 'grades' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('grades')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === 'grades' && styles.filterButtonTextActive,
            ]}>Grades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === 'revenue' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('revenue')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === 'revenue' && styles.filterButtonTextActive,
            ]}>Revenue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === 'enrollment' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('enrollment')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === 'enrollment' && styles.filterButtonTextActive,
            ]}>Enrollment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filteredReports.map((report) => (
        <View key={report._id} style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: getReportTypeColor(report.type) }]}>
                <Text style={styles.badgeText}>{report.type}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.badgeText}>{report.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.reportDetails}>
            <Text style={styles.detailText}>
              Period: {formatDate(report.period.start)} - {formatDate(report.period.end)}
            </Text>
            <Text style={styles.detailText}>
              Generated: {formatDate(report.generatedAt)}
            </Text>
          </View>

          {report.status === 'completed' && report.downloadUrl && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownloadReport(report._id)}
            >
              <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dateRangeContainer: {
    marginBottom: 24,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTypesContainer: {
    marginBottom: 24,
  },
  reportTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportTypeButton: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: '#0066cc',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  reportDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  downloadButton: {
    backgroundColor: '#0066cc',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdminReports; 