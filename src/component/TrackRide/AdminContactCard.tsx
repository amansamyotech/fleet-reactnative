import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const AdminContactCard = () => {
  return (
    <View style={styles.container}>
      <TextNormal style={styles.title}>Admin Contact Details</TextNormal>

      <View style={styles.row}>
        <TextNormal style={styles.value}>Rahul Verma</TextNormal>

      </View>

      <View style={styles.row}>
        <TextNormal style={styles.value}>+91 7828058757</TextNormal>
        <View style={{backgroundColor:color.greenColor,height:hp(3.8),width:hp(3.8),borderRadius:hp(1.8),alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'rgba(52, 199, 89, 0.3)'}}>
        <MaterialIcons name="call" size={17} color="white" />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical:spacing.sm,
    borderWidth: 1,
    marginVertical:spacing.lg,
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

export default AdminContactCard;
