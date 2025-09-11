import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity,  ActivityIndicator } from "react-native";
import TextNormal from "@/src/styles/TextNormal";
import TextBold from "@/src/styles/TextBold";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { spacing } from "@/src/styles/Spacing";
import { useRouter, useFocusEffect } from "expo-router";
import { color } from "@/src/constants/colors";
import { BookingsContext } from "@/src/app/(main)/(home)";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";



const AssignedRideBox: React.FC = () => {
  const router = useRouter();
  const { bookings, loading, error, refreshBookings } = useContext(BookingsContext);
  const booking = bookings.length > 0 ? bookings[0] : undefined;

  // useFocusEffect(
  //   React.useCallback(() => {

  //     refreshBookings();
  //     return () => {
  //     };
  //   }, [refreshBookings])
  // );

  console.log("AssignedRideBox - bookings:", bookings);
  console.log("AssignedRideBox - booking:", booking);
  const tripStartDate = booking?.tripStartDate
  ? new Date(booking.tripStartDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  : '';

  const tripEndDate = booking?.tripStartDate
  ? new Date(booking.tripEndDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  : '';


  const isStartButtonEnabled = booking?.tripStatus == "YetToStart";

  console.log(booking?.tripStatus)

const handleJourney = async (): Promise<void> => {
  if (!booking?.id) {
    console.warn("Cannot navigate to ride details: booking ID is undefined");
    return;
  }

  const bookingId = String(booking.id);

  try {
    if (booking.tripStatus === "YetToStart") {
      const payload = { tripStatus: "ongoing" };
        await rideTimelineServices.updateTripStatus(bookingId, payload);
    }
    router.navigate({
      pathname: "/rideDetails",
      params: { bookingId, booking: JSON.stringify(booking) }
    });

  } catch (error: any) {
    console.error("Error handling journey:", error);
  }
};



  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TextNormal style={styles.headText}>Assigned Ride</TextNormal>
            <TextNormal style={styles.subHeadText}>{`(Today ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`}</TextNormal>
          </View>
        </View>
        <View style={[styles.rideInfoBox, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={color.primary} />
          <TextNormal style={styles.loadingText}>Loading your assigned ride...</TextNormal>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TextNormal style={styles.headText}>Assigned Ride</TextNormal>
          </View>
        </View>
        <View style={[styles.rideInfoBox, styles.noRideContainer]}>
          <TextNormal style={styles.errorText}>Error loading rides: {error}</TextNormal>
          <TouchableOpacity style={styles.refreshButton} onPress={() => refreshBookings()}>
            <FontAwesome name="refresh" size={16} color="white" style={{ marginRight: spacing.sm }} />
            <TextNormal style={styles.refreshButtonText}>Retry</TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TextNormal style={styles.headText}>Assigned Ride</TextNormal>
            <TextNormal style={styles.subHeadText}>{`(Today ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`}</TextNormal>
          </View>
        </View>
        <View style={[styles.rideInfoBox, styles.noRideContainer]}>
          <TextNormal style={styles.noRideText}>No rides assigned for today</TextNormal>
          <TouchableOpacity style={styles.refreshButton} onPress={() => refreshBookings()}>
            <FontAwesome name="refresh" size={16} color="white" style={{ marginRight: spacing.sm }} />
            <TextNormal style={styles.refreshButtonText}>Refresh</TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TextNormal style={styles.headText}>Assigned Ride</TextNormal>
          <TextNormal style={styles.subHeadText}>{`(Today ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`}</TextNormal>
        </View>
        <View style={styles.activeContainer} />
      </View>

      {/* Ride Status */}
      <View style={styles.statusRow}>
        <TextNormal style={styles.statusLabel}>Ride Status</TextNormal>
        <TouchableOpacity style={styles.statusButton}>
          <TextNormal style={styles.statusText}>{booking.tripStatus || "Pending"}</TextNormal>
        </TouchableOpacity>
      </View>

      {/* Ride Info Box */}
      <View style={styles.rideInfoBox}>
        <View style={styles.locationRow}>
          <FontAwesome style={{marginTop: hp(0.6)}} name="circle" size={12} color={color.greenColor} />
          <TextNormal style={styles.locationLabel}>Pickup</TextNormal>
          <TextNormal style={styles.timeText}>{tripStartDate? `(Time ${tripStartDate})` : "(Time 4 PM)"}</TextNormal>
        </View>
        <TextBold style={styles.locationAddress}>{booking.tripStartLoc || "123 Market Street, San Francisco"}</TextBold>

        <View style={styles.locationRow2}>
          <FontAwesome style={{marginTop: hp(0.6)}} name="circle" size={12} color="#2D68FE" />
          <TextNormal style={styles.locationLabel}>Drop-off</TextNormal>
          <TextNormal style={styles.timeText}>{tripEndDate? `(Estimated Time ${tripEndDate})` : "(Estimated Time 4 PM)"}</TextNormal>
        </View>
        <TextBold style={styles.locationAddress}>{booking.tripEndLoc || "456 Mission Street, San Francisco"}</TextBold>
      </View>

      {/* Fare and Button */}
      <View style={styles.footer}>
        <View style={styles.fareRow}>
          <TextNormal style={styles.fareLabel}>Fare</TextNormal>
          <TextNormal style={styles.fareValue}>{booking.totalAmt ? `₹${booking.totalAmt}` : "$35"}</TextNormal>
        </View>
        <TouchableOpacity 
  style={[styles.button]} 
  onPress={handleJourney}
>
  <TextNormal style={styles.buttonText}>
    {booking?.tripStatus === "YetToStart" ? "Start Journey" : "View"}
  </TextNormal>
</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: color.primary,
    borderRadius: spacing.xl,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  headText: {
    color: "white",
    fontSize: hp(1.9),
  },
  subHeadText: {
    color: "white",
    fontSize: hp(1.4),
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  activeContainer: {
    height: hp(1.4),
    width: hp(1.4),
    borderRadius: spacing.sm,
    borderColor: "white",
    borderWidth: 0.9,
    backgroundColor: color.greenColor,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  statusLabel: {
    color: "white",
    fontSize: hp(1.8),
  },
  statusButton: {
    backgroundColor: color.pending,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.lg,
    height: hp(3.7),
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: hp(1.7),
  },
  rideInfoBox: {
    backgroundColor: "white",
    borderRadius: spacing.md,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  locationLabel: {
    marginLeft: spacing.sm,
    fontSize: hp(1.6),
  },
  timeText: {
    marginLeft: spacing.sm,
    fontSize: spacing.md,
    color: "#6B7280",
  },
  locationAddress: {
    marginLeft: hp(2.1),
    marginTop: spacing.xs,
    fontWeight: "600",
    fontSize: hp(1.6),
  },
  footer: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  fareLabel: {
    color: "white",
    fontSize: hp(1.8),
  },
  fareValue: {
    color: "white",
    fontSize: spacing.xl,
  },
  button: {
    backgroundColor: color.greenColor,
    borderRadius: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    height: hp(4.8),
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#AAAAAA", // Gray color for disabled state
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: spacing.lg,
  },
  // Added styles for the no-ride state
  noRideContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: hp(15),
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: hp(15),
  },
  loadingText: {
    marginTop: spacing.md,
    color: color.primary,
    fontSize: hp(1.6),
  },
  noRideText: {
    color: color.primary,
    fontSize: hp(1.8),
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  errorText: {
    color: 'red',
    fontSize: hp(1.6),
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  refreshButton: {
    backgroundColor: color.greenColor,
    borderRadius: spacing.xl,
    paddingHorizontal: spacing.xl,
    height: hp(4),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  refreshButtonText: {
    color: "white",
    fontSize: hp(1.6),
  }
});

export default AssignedRideBox;