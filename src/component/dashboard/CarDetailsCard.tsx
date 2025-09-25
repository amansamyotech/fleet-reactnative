// import { BookingsContext } from "@/src/app/(main)/(home)";
// import { color } from "@/src/constants/colors";
// import { spacing } from "@/src/styles/Spacing";
// import TextNormal from "@/src/styles/TextNormal";
// import React, { useContext } from "react";
// import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
// import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// const CarDetailsCard = () => {
//     const { bookings } = useContext(BookingsContext);
//     const booking = bookings.length > 0 ? bookings[0] : undefined;
//   return (
//     <TouchableOpacity style={styles.container}>
//       <Image
//          source={require('../../assets/images/carImg.png')}
//         style={styles.carImage}
//         resizeMode="contain"
//       />
//       <View style={styles.textContainer}>
//         <TextNormal style={styles.title}>Vehicle Details</TextNormal>
//         <TextNormal style={styles.subtitle}>{booking?.vehicle.vehicleName}</TextNormal>
//         <TextNormal style={styles.plate}>{booking?.vehicle.registrationNo}</TextNormal>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     borderRadius: spacing.sm,
//     paddingVertical: spacing.xl,
//     paddingHorizontal: spacing.sm,
//     borderWidth: 1,
//     borderColor: color.border,
//     alignItems: "center",
//     gap: spacing.lg,
//   },
//   carImage: {
//     aspectRatio: 1.5,
//     flexShrink: 0,
//     height: '100%',
//     maxHeight: hp(10),
//   },
//   textContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: hp(1.9),
//     fontWeight: "700",
//     color: color.textPrimary,
//     marginBottom: hp(0.3),
//   },
//   subtitle: {
//     fontSize: hp(1.7),
//     color: color.labelColor,
//     marginBottom: hp(0.2),
//     flexWrap: 'wrap',
//   },
//   plate: {
//     fontSize: hp(1.6),
//     color: color.labelColor,
//     fontWeight: "600",
//   },
// });

// export default CarDetailsCard;
import { BookingsContext } from "@/src/app/(main)/(home)";
import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const CarDetailsCard = () => {
  const { bookings } = useContext(BookingsContext);
  const booking = bookings.find(b => b.tripStatus !== "Cancelled") || undefined;
  if (!booking) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Image
          source={require("../../assets/images/carImg.png")}
          style={styles.emptyCarImage}
          resizeMode="contain"
        />
        <TextNormal style={styles.emptyText}>
          Vehicle and customer details are not available
        </TextNormal>
      </View>
    );
  }

  // normal layout
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={require("../../assets/images/carImg.png")}
        style={styles.carImage}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <TextNormal style={styles.title}>Vehicle Details</TextNormal>
        <TextNormal style={styles.subtitle}>
          {booking.vehicle.vehicleName}
        </TextNormal>
        <TextNormal style={styles.plate}>
          {booking.vehicle.registrationNo}
        </TextNormal>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    // default row direction for when booking exists
    flexDirection: "row",
  },
  emptyContainer: {
    flexDirection: "column",
  },
  carImage: {
    aspectRatio: 1.5,
    flexShrink: 0,
    height: "100%",
    maxHeight: hp(10),
  },
  emptyCarImage: {
    width: hp(12),
    height: hp(5),
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: hp(1.9),
    fontWeight: "700",
    color: color.textPrimary,
    marginBottom: hp(0.3),
  },
  subtitle: {
    fontSize: hp(1.7),
    color: color.labelColor,
    marginBottom: hp(0.2),
    flexWrap: "wrap",
  },
  plate: {
    fontSize: hp(1.6),
    color: color.labelColor,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: hp(1.7),
    color: color.labelColor,
    textAlign: "center",
    marginTop: hp(0.5),
  },
});

export default CarDetailsCard;
