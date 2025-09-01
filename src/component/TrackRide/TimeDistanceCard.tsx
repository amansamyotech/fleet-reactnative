import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const TimeDistanceCard = () => {
  return (
    <View style={styles.container}>
      <TextNormal style={styles.title}>Estimated Time & Distance</TextNormal>

      <View style={styles.row}>
        <TextNormal style={styles.label}>Distance</TextNormal>
        <TextNormal style={styles.value}>200 Kilometers</TextNormal>
      </View>

      <View style={styles.row}>
        <TextNormal style={styles.label}>Time</TextNormal>
        <TextNormal style={styles.value}>Maximum 2 Hours</TextNormal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical:spacing.sm,
    borderWidth: 1,
    marginVertical:spacing.xs,
    borderColor: color.border,
    gap: spacing.xs,
  },
  title: {
    fontSize: hp(1.7),
    fontWeight: "700",
    color: color.textPrimary,
  },
  row: {
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
    fontWeight: "600",
  },
});

export default TimeDistanceCard;