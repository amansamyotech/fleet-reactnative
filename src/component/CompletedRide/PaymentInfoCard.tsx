import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React from "react";
import { View, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const PaymentInfoCard = () => {
  return (
    <View style={styles.container}>
    
      <TextNormal style={styles.title}>Payment Info</TextNormal>


      <View style={styles.row}>
        <TextNormal style={styles.label}>Payment Mode</TextNormal>
        <TextNormal style={styles.value}>UPI</TextNormal>
      </View>


      <View style={styles.row}>
        <TextNormal style={styles.label}>Payment Status</TextNormal>
        <TextNormal style={styles.value}>Paid</TextNormal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: spacing.lg,
    paddingVertical:spacing.sm,
    gap: spacing.xs,
  },
  title: {
    fontSize: hp(1.6),
    fontWeight: "700",
    color: color.textPrimary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: hp(1.6),
    color: color.labelColor,
  },
  value: {
    fontSize: hp(1.6),
    color: color.textPrimary,
    fontWeight: "500",
  },
});

export default PaymentInfoCard;
