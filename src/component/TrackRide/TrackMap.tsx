import { color } from "@/src/constants/colors";
import TextNormal from "@/src/styles/TextNormal";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { heightPercentageToDP as hp} from "react-native-responsive-screen";

const TrackMap = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 1.3125,
          longitude: 103.923,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />
    </View>
  );
};

export default TrackMap;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
  },
  map: {
    height: 400,
    width: "100%",
  },

});
