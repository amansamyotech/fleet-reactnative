import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const AssignedRideCard = () => {
  return (
    <View style={styles.container}>
    
      <View style={styles.headerRow}>
        <TextNormal style={styles.title}>Assigned Ride</TextNormal>
        <TextNormal style={styles.date}>(Today 4-Apr-2025)</TextNormal>
      </View>

 
      <View style={styles.statusRow}>
        <TextNormal style={styles.label}>Ride Status</TextNormal>
        <View style={styles.statusBadge}>
          <TextNormal style={styles.statusText}>Completed</TextNormal>
        </View>
      </View>

   
      <View style={styles.section}>
        <TextNormal style={styles.sectionTitle}>Time & Distance</TextNormal>
        <View style={styles.detailRow}>
          <TextNormal style={styles.label}>Distance</TextNormal>
          <TextNormal style={styles.value}>200 Kilometers</TextNormal>
        </View>
        <View style={styles.detailRow}>
          <TextNormal style={styles.label}>Time</TextNormal>
          <TextNormal style={styles.value}>Maximum 2 Hours</TextNormal>
        </View>
      </View>

 
      <View style={styles.fareRow}>
        <TextNormal style={styles.label}>Final Fare</TextNormal>
        <TextNormal style={styles.fare}>$35</TextNormal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical:spacing.sm,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: color.border,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: hp(0.7),
  },
  title: {
    fontSize: hp(1.9),
    fontWeight: "700",
    color: color.textPrimary,
  },
  date: {
    fontSize: spacing.md,
    color: "#6B7280",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: hp(1.6),
    color: color.labelColor,
  },
  value: {
    fontSize: hp(1.6),
    color: color.textPrimary,
    fontWeight: "300",
  },
  statusBadge: {
    backgroundColor: color.greenColor,
    paddingHorizontal: spacing.lg,
    paddingVertical: hp(0.7),
    borderRadius: hp(5),
  },
  statusText: {
    color: "white",
    fontSize: spacing.md,
    fontWeight: "600",
  },
  section: {
    gap: hp(0.8),
  },
  sectionTitle: {
    fontSize: hp(1.6),
    fontWeight: "700",
    color: color.textPrimary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  fare: {
    fontSize: spacing.xl,
    fontWeight: "700",
    color: color.textPrimary,
  },
});

export default AssignedRideCard;
