import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import TextNormal from "@/src/styles/TextNormal";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { spacing } from "@/src/styles/Spacing";
import { AntDesign } from "@expo/vector-icons";
import { BookingsContext } from "@/src/app/(main)/(home)";

interface CommonHeaderProps {
  title: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ title }) => {
  const router = useRouter();
  const { bookings, loading, error, refreshBookings } = useContext(BookingsContext);


  const handleBack =async () => {
    if (bookings) {
        await refreshBookings()
        router.back();


    } else {
     
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <TextNormal style={styles.title}>{title}</TextNormal>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: hp(7),
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: hp(2.2),
    fontWeight: "500",
  },
  placeholder: {
    width: hp(3), // Same width as the back button for symmetry
  },
});

export default CommonHeader;