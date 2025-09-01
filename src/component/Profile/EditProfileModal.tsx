import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import TextNormal from '@/src/styles/TextNormal';
import { color } from '@/src/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

import profileService from '@/src/api/services/main/profileServices';
import useLoginDataStorage from '@/src/hooks/customStorageHook';
import { profileUpdateListener } from './ProfileCard'; 


interface DriverData {
  id: number;
  name: string;
  mobileNo: string;
  age: number;
  address: string;
  licenseNo: string;
  licenseExpiry: string;
  dateOfJoining: string;
  totalExp: number;
  notes: string;
  image: string;
  doc: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  password: string;
  iv: string;
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void; 
}

const EditProfile: React.FC<EditProfileModalProps> = ({ 
  visible, 
  onClose, 
  onProfileUpdated, 
}) => {

  const [name, setName] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [licenseNo, setLicenseNo] = useState<string>('');
  const [licenseExpiry, setLicenseExpiry] = useState<Date>(new Date());
  

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const {loginData} = useLoginDataStorage()
  const driverId = loginData?.id;
  const {storeLoginData} = useLoginDataStorage()
  const token = loginData?.token

  useEffect(() => {
    if (visible) {
      fetchDriverData();
    }
  }, [visible, driverId]);

  const fetchDriverData = async (): Promise<void> => {
    try {
      setInitialLoading(true);
      if (!loginData || !loginData.id) {
        throw new Error("Driver ID not found");
      }

   
      const response = await profileService.getDriverById(loginData.id);
      if (response.success) {
        console.log(response.data)
        const driverData: DriverData = response.data;
        setName(driverData.name);
        setMobileNo(driverData.mobileNo);
        setAddress(driverData.address);
        setLicenseNo(driverData.licenseNo);
        setLicenseExpiry(new Date(driverData.licenseExpiry));
      } else {
        throw new Error(response.message || "Failed to fetch driver data");
      }
    } catch (err: any) {
      console.error("Error fetching driver data:", err);
      setError(err.message);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
      
   
      const cachedData = await profileService.getDriverData();
      if (cachedData) {
        setName(cachedData.name);
        setMobileNo(cachedData.mobileNo);
        setAddress(cachedData.address);
        setLicenseNo(cachedData.licenseNo);
        setLicenseExpiry(new Date(cachedData.licenseExpiry));
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true);
    
      if (!name.trim() || !mobileNo.trim() || !address.trim() || !licenseNo.trim()) {
        Alert.alert("Validation Error", "All fields are required");
        setLoading(false);
        return;
      }

      if (!driverId || !token) {
        Alert.alert("Error", "User data is missing or incomplete");
        setLoading(false);
        return;
      }

      const formattedDate = licenseExpiry.toISOString();

      const updateData = {
        name,
        mobileNo,
        address,
        licenseNo,
        licenseExpiry: formattedDate
      };

      const response = await profileService.updateDriverProfile(Number(driverId), updateData);
      
      if (response.success) {
        profileUpdateListener.notify();
        
        Alert.alert("Success", "Profile updated successfully");
        
        if (onProfileUpdated) {
          onProfileUpdated();
        }
        
        onClose();
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLicenseExpiry(selectedDate);
    }
  };

  if (initialLoading) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <View style={[styles.container, styles.loadingContainer]}>
            <ActivityIndicator size="large" color={color.primary} />
            <TextNormal style={styles.loadingText}>Loading profile data...</TextNormal>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TextNormal style={styles.title}>Edit Profile</TextNormal>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput 
                placeholder="Name" 
                style={styles.input} 
                value={name}
                onChangeText={setName}
              />
              
              <TextInput 
                placeholder="Contact Number" 
                style={styles.input} 
                keyboardType="number-pad"
                value={mobileNo}
                onChangeText={setMobileNo}
                maxLength={10}
              />
              
              <TextInput 
                placeholder="Address" 
                style={[styles.input, styles.textArea]} 
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
              
              <TextInput 
                placeholder="License Number" 
                style={styles.input} 
                value={licenseNo}
                onChangeText={setLicenseNo}
                autoCapitalize="characters"
              />
              
              <TouchableOpacity 
                style={styles.dateInput} 
                onPress={() => setShowDatePicker(true)}
              >
                <TextNormal style={styles.dateText}>
                  License Expiry: {formatDateForDisplay(licenseExpiry)}
                </TextNormal>
                <MaterialIcons name="date-range" size={20} color="#555" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={licenseExpiry}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <TextNormal style={styles.buttonText}>Save Changes</TextNormal>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: color.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: color.primary,
  },
  dateInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EditProfile;