import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import OuterContainer from "@/src/styles/OuterContainer";
import DashboardHeader from "@/src/component/dashboard/DashboardHeader";
import AssignedRideBox from "@/src/component/dashboard/AssignedRideBox";
import CarDetailsCard from "@/src/component/dashboard/CarDetailsCard";
import CustomerDetailsCard from "@/src/component/dashboard/CustomerDetailsCard";
import { spacing } from "@/src/styles/Spacing";
import { createContext } from 'react';
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";
import { Booking } from "@/src/component/dashboard/RideTypes";
import useLoginDataStorage from "@/src/hooks/customStorageHook";



export const BookingsContext = createContext<{
  bookings: Booking[];
  loading: boolean
  error: string | null;
  refreshBookings: () => Promise<void>;
}>({
  bookings: [],
  loading: false,
  error: null,
  refreshBookings: async () => {}  
});

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { loginData } = useLoginDataStorage();
  console.log(`loginDataloginDataloginDataloginData`,loginData);
  
  
  const fetchBookings = useCallback(async () => {
    if (!loginData?.id) {
      setError("Driver ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await rideTimelineServices.getTodayBookings(loginData.id);   
      console.log(`responseresponseresponse`,response);
      
      if (!response) {
        throw new Error("No data received from API");
      }
      const bookingsData = Array.isArray(response) ? response : [];
      setBookings(bookingsData);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loginData?.id]);

const handleRefresh = useCallback(async () => {
  setRefreshing(true);
  await fetchBookings();
}, [fetchBookings]);

useEffect(() => {
  if (loginData?.id) {
    fetchBookings();
  }
}, [loginData?.id]);
  
const contextValue = useMemo(() => ({
  bookings,
  loading,
  error,
  refreshBookings: fetchBookings
}), [bookings, loading, error, fetchBookings]);
  
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
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchBookings}
          >
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
      </ScrollView>
    );
  };

  return (
    <BookingsContext.Provider value={contextValue}>
      <OuterContainer>
        {renderContent()}
      </OuterContainer>
    </BookingsContext.Provider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default Dashboard;