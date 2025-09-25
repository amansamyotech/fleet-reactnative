import { BookingsContext } from "@/src/app/(main)/(home)";
import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React, { useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const CustomerDetailsCard = () => {
  const { bookings } = useContext(BookingsContext);
 const booking = bookings.find(b => b.tripStatus !== "Cancelled") || undefined;
  if (!booking || !booking.customer) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.title}>Customer Details</Text>

      <View style={styles.row}>
        <TextNormal style={styles.label}>Name</TextNormal>
        <TextNormal style={styles.value}>{booking?.customer.name}</TextNormal>
      </View>

      <View style={styles.row}>
        <TextNormal style={styles.label}>Contact Info.</TextNormal>
        <TextNormal style={styles.value}>{booking?.customer.mobileNo}</TextNormal>
      </View>

      <View style={styles.row}>
        <TextNormal style={styles.label}>Email</TextNormal>
        <TextNormal style={styles.value}>{booking?.customer.email}</TextNormal>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    borderWidth: 1,
    borderColor: color.border,
    gap: spacing.xs,
  },
  title: {
    fontSize: hp(1.9),
    fontWeight: "700",
    color: color.textPrimary,
    marginBottom: spacing.xs,
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

export default CustomerDetailsCard;
