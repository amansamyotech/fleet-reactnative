import { color } from "@/src/constants/colors";
import TextNormal from "@/src/styles/TextNormal";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ListRenderItem } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { format } from "date-fns";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";
import { Ride } from "./RideTypes";
import useLoginDataStorage from "@/src/hooks/customStorageHook";

interface RideListProps {
  activeTab?: "upcoming" | "completed";
  filterOption?: "All" | "This Month" | "Last Month" | "Custom";
}

const RideList: React.FC<RideListProps> = ({ 
  activeTab ,
  filterOption 
}) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { loginData } = useLoginDataStorage();

  console.log(activeTab)

  const fetchRides = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      if (!loginData || !loginData.id) {
        throw new Error("Driver ID not found");
      }
     
      const response = await rideTimelineServices.getDriverRides(loginData.id);
      
      if (response && response.success) {
        console.log('====>',response.data)
        setRides(response.data || []);
        setError(null);
      } else {
        setError("Failed to fetch rides");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  }, [loginData]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides, activeTab, filterOption]);

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      console.error("Invalid time format:", dateString);
      return "Invalid time";
    }
  };

  const filteredRides = rides.filter(ride => {
    if (!ride || !ride.tripStartDate) return false;
    
    try {
      const today = new Date();
      const tripStartDate = new Date(ride.tripStartDate);

      
      if (activeTab === "upcoming") {
        return  (tripStartDate >= today && ride.tripStatus !== "Completed");
      } else {
        const isCompleted = ride.tripStatus === "Completed" || (tripStartDate < today);
        
        if (isCompleted && filterOption !== "All") {
          const currentDate = new Date();
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
          const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
          
          if (filterOption === "This Month") {
            return tripStartDate >= startOfMonth;
          } else if (filterOption === "Last Month") {
            return tripStartDate >= startOfLastMonth && tripStartDate <= endOfLastMonth;
          } else if (filterOption === "Custom") {
            return true;
          }
        }
        
        return isCompleted;
      }
    } catch (error) {
      console.error("Error filtering ride:", error);
      return false;
    }
  });

  const renderItem: ListRenderItem<Ride> = ({ item }) => {
    if (!item) return null;
    
  
    const fare = `₹${(item.totalAmt || 0).toFixed(2)}`;
    
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <TextNormal style={styles.dateText}>
            {formatDate(item.tripStartDate)} • {formatTime(item.tripStartDate)}
          </TextNormal>
          <Text style={styles.fareText}>{fare}</Text>
        </View>
  
        <View style={styles.locationRow}>
          <View style={styles.dotColumn}>
            <View style={[styles.dot, { backgroundColor: color.redColor, borderColor: 'rgba(255, 77, 73, 0.2)' }]} />
            <View style={styles.verticalLine} />
          </View>
          <View>
            <TextNormal style={styles.locationText}>{item.tripStartLoc || 'N/A'}</TextNormal>
            <TextNormal style={styles.subText}>Pickup Location</TextNormal>
          </View>
        </View>
        <View style={styles.locationRow}>
          <View style={styles.dotColumn}>
            <View style={[styles.dot, { backgroundColor: color.greenColor, borderColor: 'rgba(52, 199, 89, 0.2)' }]} />
          </View>
          <View>
            <TextNormal style={styles.locationText}>{item.tripEndLoc || 'N/A'}</TextNormal>
            <TextNormal style={styles.subText}>Drop off Location</TextNormal>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.tripInfoContainer}>
            <TextNormal style={styles.tripInfoLabel}>Trip Type</TextNormal>
            <TextNormal style={styles.tripInfoValue}>{item.tripType || 'N/A'}</TextNormal>
          </View>
          <View style={styles.tripInfoContainer}>
            <TextNormal style={styles.tripInfoLabel}>Distance</TextNormal>
            <TextNormal style={styles.tripInfoValue}>{(item.totalKm || 0).toFixed(2)} km</TextNormal>
          </View>
          <View style={styles.tripInfoContainer}>
            <TextNormal style={styles.tripInfoLabel}>Invoice</TextNormal>
            <TextNormal style={styles.tripInfoValue}>{item.invoiceNo || 'N/A'}</TextNormal>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TextNormal style={styles.errorText}>{error}</TextNormal>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRides}>
          <TextNormal style={styles.retryText}>Retry</TextNormal>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredRides.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TextNormal style={styles.emptyText}>
          No {activeTab === "upcoming" ? "upcoming" : "completed"} rides found
        </TextNormal>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredRides}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: hp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: hp(2),
  },
  errorText: {
    fontSize: hp(2),
    color: "#EF4444",
    textAlign: "center",
    marginBottom: hp(2),
  },
  retryButton: {
    backgroundColor: color.primary,
    paddingVertical: hp(1),
    paddingHorizontal: hp(3),
    borderRadius: hp(1),
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: hp(2),
  },
  emptyText: {
    fontSize: hp(2),
    color: color.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: hp(1.5),
    width: '100%',
    padding: hp(1.5),
    marginBottom: hp(1.2),
    borderWidth: 1,
    borderColor: color.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  dateText: {
    fontSize: hp(1.6),
    color: color.textSecondary,
    fontWeight: "500",
  },
  fareText: {
    fontSize: hp(2),
    fontWeight: "600",
    color: color.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    marginBottom: hp(0.1),
  },
  dotColumn: {
    width: wp(8),
    marginTop: hp(0.6),
    alignItems: "center",
  },
  dot: {
    height: hp(1.8),
    width: hp(1.8),
    borderRadius: hp(1),
    borderWidth: 3,
  },
  verticalLine: {
    width: 1,
    height: hp(3.5),
    backgroundColor: "rgba(76, 78, 100, 0.12)",
    marginTop: 2,
  },
  locationText: {
    fontSize: hp(1.7),
    fontWeight: "700",
    color: color.textPrimary,
  },
  subText: {
    fontSize: hp(1.4),
    color: color.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(76, 78, 100, 0.12)",
    paddingTop: hp(1.5),
    marginTop: hp(1.5),
  },
  tripInfoContainer: {
    alignItems: "center",
  },
  tripInfoLabel: {
    fontSize: hp(1.4),
    color: color.textSecondary,
    marginBottom: 2,
  },
  tripInfoValue: {
    fontSize: hp(1.6),
    color: color.textPrimary,
    fontWeight: "600",
  },
});

export default RideList;