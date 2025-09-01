// // import { color } from "@/src/constants/colors";
// // import TextNormal from "@/src/styles/TextNormal";
// // import { router, useRouter } from "expo-router";
// // import React from "react";
// // import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// // import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// // import { heightPercentageToDP as hp} from "react-native-responsive-screen";

// // const MapComponent = () => {
// //     const router = useRouter();
// //   return (
// //     <View style={styles.container}>
// //       <MapView
// //         style={styles.map}
// //         provider={PROVIDER_GOOGLE}
// //         initialRegion={{
// //           latitude: 1.3125,
// //           longitude: 103.923,
// //           latitudeDelta: 0.01,
// //           longitudeDelta: 0.01,
// //         }}
// //       />
// //       <View style={styles.buttonContainer}>
// //         <TouchableOpacity style={styles.cancelButton} onPress={()=>{router.back()}}>
// //           <TextNormal style={styles.cancelText}>Cancel Ride</TextNormal>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.trackButton} onPress={()=>{router.push('/trackRide')}}>
// //           <TextNormal style={styles.trackText}>Track on Map</TextNormal>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // export default MapComponent;

// // const styles = StyleSheet.create({
// //   container: {
// //     overflow: "hidden",
// //     backgroundColor: "#fff",
// //     shadowOffset: { width: 0, height: 2 },
// //   },
// //   map: {
// //     height: 400,
// //     width: "100%",
// //   },
// //   buttonContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingVertical: hp(3),
// //     backgroundColor: "#fff",
// //   },
// //   cancelButton: {
// //     borderColor: color.border,
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     paddingVertical: 10,
// //     paddingHorizontal: hp(5),
// //   },
// //   cancelText: {
// //     color: "#000",
// //     fontWeight: "500",
// //   },
// //   trackButton: {
// //     backgroundColor: color.greenColor,
// //     borderRadius: 10,
// //     paddingVertical: 10,
// //     paddingHorizontal: hp(5),
// //   },
// //   trackText: {
// //     color: "#fff",
// //     fontWeight: "500",
// //   },
// // });

// import React, { useEffect, useRef, useState } from "react";
// import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
// import MapView, { Marker, UrlTile } from "react-native-maps";
// import * as Location from "expo-location";
// import { router, useRouter } from "expo-router";
// import { heightPercentageToDP as hp } from "react-native-responsive-screen";
// import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";

// interface mapComponentProps {
//   bookingId?: string;
// }

// const MapComponent: React.FC<mapComponentProps> = ({ bookingId }) => {
//   const router = useRouter();
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const [location, setLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Location Permission",
//           "Permission to access location was denied"
//         );
//         return;
//       }

//       // Immediate fetch
//       const initialLoc = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: initialLoc.coords.latitude,
//         longitude: initialLoc.coords.longitude,
//       });
//       // sendLocationToBackend(initialLoc.coords.latitude, initialLoc.coords.longitude);

//       // Then fetch every 5 sec
//       intervalRef.current = setInterval(async () => {
//         const loc = await Location.getCurrentPositionAsync({});
//         setLocation({
//           latitude: loc.coords.latitude,
//           longitude: loc.coords.longitude,
//         });
//         console.log("Location updated:", loc.coords);
//         // sendLocationToBackend(loc.coords.latitude, loc.coords.longitude);
//       }, 5000);
//     })();

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const sendLocationToBackend = async (latitude: number, longitude: number) => {
//     try {
//       await fetch("https://your-backend-url.com/api/update-location", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ latitude, longitude }),
//       });
//     } catch (error) {
//       console.error("Error sending location:", error);
//     }
//   };

//   const handleJourney = async () => {
//     if (bookingId) {
//       try {
//         const payload = {
//           tripStatus: "Completed",
//         };
//         await rideTimelineServices.updateTripStatus(bookingId, payload);

//         router.navigate("/(main)/(home)");
//       } catch (error: any) {
//         console.error("Error updating trip status:", error);
//       }
//     } else {
//       console.warn("Cannot navigate to ride details: booking ID is undefined");
//       router.navigate("/rideDetails");
//     }
//   };

//   const handleCancel = async () => {
//     if (bookingId) {
//       try {
//         const payload = {
//           tripStatus: "Cancelled",
//         };
//         await rideTimelineServices.updateTripStatus(bookingId, payload);

//         router.navigate("/(main)/(home)");
//       } catch (error: any) {
//         console.error("Error updating trip status:", error);
//       }
//     } else {
//       console.warn("Cannot navigate to ride details: booking ID is undefined");
//       router.navigate("/rideDetails");
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: location?.latitude || 1.3125,
//           longitude: location?.longitude || 103.923,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         region={
//           location
//             ? {
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//               }
//             : undefined
//         }
//       >
//         <UrlTile
//           urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           maximumZ={19}
//           flipY={false}
//         />
//         {location && <Marker coordinate={location} title="You are here" />}
//       </MapView>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
//           <Text style={{ color: "white" }}>Cancel Ride</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.trackButton} onPress={handleJourney}>
//           <Text style={{ color: "white" }}>Journey Complete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default MapComponent;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   buttonContainer: {
//     position: "absolute",
//     bottom: hp("5%"),
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   cancelButton: {
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 8,
//   },
//   trackButton: {
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 8,
//   },
// });
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";

interface MapComponentProps {
  bookingId?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ bookingId }) => {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied"
        );
        return;
      }

      // Get initial location
      const initialLoc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: initialLoc.coords.latitude,
        longitude: initialLoc.coords.longitude,
      });

      // Update location every 5s
      intervalRef.current = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        console.log("Location updated:", loc.coords);
      }, 5000);
    })();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleJourney = async () => {
    if (bookingId) {
      try {
        await rideTimelineServices.updateTripStatus(bookingId, {
          tripStatus: "Completed",
        });
        router.replace("/(main)/(home)");
      } catch (error) {
        console.error("Error updating trip status:", error);
      }
    } else {
      router.replace("/rideDetails");
    }
  };

  const handleCancel = async () => {
    if (bookingId) {
      try {
        await rideTimelineServices.updateTripStatus(bookingId, {
          tripStatus: "Cancelled",
        });
        router.replace("/(main)/(home)");
      } catch (error) {
        console.error("Error updating trip status:", error);
      }
    } else {
      router.replace("/rideDetails");
    }
  };

  console.log(`locationlocation`, location);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          region={{
            latitude: location.latitude,

            longitude: location.longitude,

            latitudeDelta: 0.01,

            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="You are here" pinColor="blue" />
        </MapView>
      )}

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackButton} onPress={handleJourney}>
          <Text style={styles.buttonText}>Journey Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: hp("5%"),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  trackButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
