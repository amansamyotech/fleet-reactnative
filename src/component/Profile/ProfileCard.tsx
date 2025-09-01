
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, ActivityIndicator} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import TextNormal from "@/src/styles/TextNormal";
import TextBold from "@/src/styles/TextBold";
import { color } from "@/src/constants/colors";
import profileService from "@/src/api/services/main/profileServices";
import useLoginDataStorage from "@/src/hooks/customStorageHook";

// Define interfaces
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
  imageUrl: string;
  doc: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  password: string;
  iv: string;
}


export const createProfileUpdateListener = () => {
  let listeners: (() => void)[] = [];
  
  return {
    subscribe: (callback: () => void) => {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter(listener => listener !== callback);
      };
    },
    notify: () => {
      listeners.forEach(listener => listener());
    }
  };
};


export const profileUpdateListener = createProfileUpdateListener();

const ProfileCard: React.FC = () => {
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState<boolean>(false);
  const { loginData } = useLoginDataStorage();
  const [updateCounter, setUpdateCounter] = useState<number>(0);

  const fetchDriverData = useCallback(async (showLoading = true): Promise<void> => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      if (!loginData || !loginData.id) {
        throw new Error("Driver ID not found");
      }
      
      const response = await profileService.getDriverById(loginData.id);
      
      if (response.success) {
        console.log("Fetched driver data:", response.data);
        setDriver(response.data as DriverData);
      
        if (response.message && response.message.includes("cached data")) {
          setIsOfflineData(true);
          setError(response.message);
        } else {
          setIsOfflineData(false);
          setError(null);
        }
      } else {
        throw new Error(response.message || "Failed to fetch driver data");
      }
    } catch (err: any) {
      console.error("Error fetching driver data:", err);
      setError(err.message);
      setIsOfflineData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loginData]);

  useEffect(() => {
    fetchDriverData();
    

    const unsubscribe = profileUpdateListener.subscribe(() => {
      console.log("Profile update detected, refreshing data...");
      setUpdateCounter(prev => prev + 1);
    });
    
 
    return () => unsubscribe();
  }, [fetchDriverData, loginData, updateCounter]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
        <TextNormal style={styles.loadingText}>Loading profile...</TextNormal>
      </View>
    );
  }

  if (error && !driver) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={40} color="red" />
        <TextNormal style={styles.errorText}>
          {error || "Failed to load profile data"}
        </TextNormal>
      </View>
    );
  }

  if (!driver) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={40} color="red" />
        <TextNormal style={styles.errorText}>
          No driver data available. Please try again later.
        </TextNormal>
      </View>
    );
  }

 
  const imageSource = driver.imageUrl ? 
    { uri: driver.imageUrl} : 
    require('../../assets/images/user.png');

  return (

    <View>
      <TextBold style={styles.heading}>Profile</TextBold>

      {isOfflineData && (
        <View style={styles.offlineNotice}>
          <MaterialIcons name="cloud-off" size={16} color="#856404" />
          <TextNormal style={styles.offlineText}>{error}</TextNormal>
        </View>
      )}

      <View style={styles.card}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={imageSource}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <TextNormal style={styles.name}>{driver.name}</TextNormal>
            <TextNormal style={styles.email}>Driver ID: {driver.id}</TextNormal>
          </View>
          <View style={styles.statusWrapper}>
            <TextNormal style={styles.statusText}>{driver.status}</TextNormal>
            <View style={[styles.statusDot, 
              { backgroundColor: driver.status === 'Active' ? color.greenColor : '#FFA500' }]} />
          </View>
        </View>

        {/* Info Rows */}
        <View style={styles.row}>
          <MaterialIcons name="phone" size={16} color="#555" />
          <TextNormal style={styles.rowText}>{driver.mobileNo}</TextNormal>
        </View>
        <View style={styles.row}>
          <FontAwesome name="id-card" size={14} color="#555" />
          <TextNormal style={styles.rowText}>License No: {driver.licenseNo}</TextNormal>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="event" size={16} color="#555" />
          <TextNormal style={styles.rowText}>License Expiry: {formatDate(driver.licenseExpiry)}</TextNormal>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={16} color="#555" />
          <TextNormal style={styles.rowText}>{driver.address}</TextNormal>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="date-range" size={16} color="#555" />
          <TextNormal style={styles.rowText}>Joined: {formatDate(driver.dateOfJoining)}</TextNormal>
        </View>
      </View>
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: hp(2.4),
    fontWeight: "700",
    marginVertical: hp(1.2),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    backgroundColor: color.primary,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    // marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15.3,
  },
  email: {
    color: "#e1e1e1",
    fontSize: 12,
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.greenColor,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  rowText: {
    color: "#333",
    fontSize: 13.5,
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: color.primary,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },
  offlineText: {
    color: '#856404',
    fontSize: 12,
    flex: 1,
  }
});

export default ProfileCard;