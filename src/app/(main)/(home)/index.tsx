import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import OuterContainer from "@/src/styles/OuterContainer";
import DashboardHeader from "@/src/component/dashboard/DashboardHeader";
import AssignedRideBox from "@/src/component/dashboard/AssignedRideBox";
import CarDetailsCard from "@/src/component/dashboard/CarDetailsCard";
import CustomerDetailsCard from "@/src/component/dashboard/CustomerDetailsCard";
import { spacing } from "@/src/styles/Spacing";
import { createContext } from "react";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";
import { Booking } from "@/src/component/dashboard/RideTypes";
import useLoginDataStorage from "@/src/hooks/customStorageHook";
import RideList from "@/src/component/dashboard/Ridelist";
import TextNormal from "@/src/styles/TextNormal";
import { color } from "@/src/constants/colors";

export const BookingsContext = createContext<{
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refreshBookings: () => Promise<void>;
  refreshKey: number;   
}>({
  bookings: [],
  loading: false,
  error: null,
  refreshBookings: async () => {},
 refreshKey: 0,
});

const Dashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { loginData } = useLoginDataStorage();
  console.log(`loginDataloginDataloginDataloginData`, loginData);

  const fetchBookings = useCallback(async () => {
    if (!loginData?.id) {
      setError("Driver ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await rideTimelineServices.getTodayBookings(
        loginData.id
      );
      console.log(`responseresponseresponse`, response);

      if (!response) {
        throw new Error("No data received from API");
      }
      const bookingsData = Array.isArray(response) ? response : [];
      setBookings(bookingsData);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch bookings";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loginData?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    rideTimelineServices.clearBookingsCache();
    await fetchBookings();
    setRefreshKey(prev => prev + 1); 
  }, [fetchBookings]);

  useEffect(() => {
    if (loginData?.id) {
      fetchBookings();
    }
  }, [loginData?.id]);

  const contextValue = useMemo(
    () => ({
      bookings,
      loading,
      error,
      refreshBookings: fetchBookings,
      refreshKey
    }),
    [bookings, loading, error, fetchBookings]
  );

  const renderContent = () => {
    // if ( bookings.length === 0) {
    //   return (
    //     <View style={styles.centerContainer}>
    //       <ActivityIndicator size="large" />
    //       <Text style={styles.loadingText}>Loading your  dashboard...</Text>
    //     </View>
    //   );
    // }

    if (error && bookings.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4285F4"]}
          />
        }
      >
        <View style={{ flex: 3 }}>
          <DashboardHeader />
          <AssignedRideBox />
        </View>
        <View style={{ flex: 2, marginTop: spacing.lg }}>
          <CarDetailsCard />
          <CustomerDetailsCard />
        </View>
        <View style={{ flex: 2, marginTop: spacing.lg }}>
          <View style={styles.rideTextContainer}>
            <TextNormal style={styles.ridesText}>Upcoming Rides -</TextNormal>
          </View>
          <RideList activeTab={"upcoming"} filterOption={"This Month"} />
        </View>
        <View style={{ flex: 2, marginTop: spacing.lg }}>
          <View style={styles.rideTextContainer}>
            <TextNormal style={styles.ridesText}>Completed Rides -</TextNormal>
          </View>
          <RideList activeTab={"completed"} filterOption={"This Month"} />
        </View>
      </ScrollView>
    );
  };

  return (
    <BookingsContext.Provider value={contextValue}>
      <OuterContainer>{renderContent()}</OuterContainer>
    </BookingsContext.Provider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: "#4285F4",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  rideTextContainer: {
    backgroundColor: color.primary,
    marginBottom: spacing.sm,
    borderRadius: 10,
  },
  ridesText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    padding: spacing.sm,
  },
});

export default Dashboard;
