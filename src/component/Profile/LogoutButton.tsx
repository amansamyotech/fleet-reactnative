import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { color } from "@/src/constants/colors";
import { heightPercentageToDP } from "react-native-responsive-screen";
import TextNormal from "@/src/styles/TextNormal";
import useLoginDataStorage from "@/src/hooks/customStorageHook";
import { router } from "expo-router";

const LogoutButton = () => {
  const {logout} = useLoginDataStorage();
  const handleLogout = async() => {
     await logout();
     router.push("/(auth)/(login)");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={(handleLogout)}>
        <TextNormal style={styles.buttonText}>Logout</TextNormal>
        <Feather name="log-out" size={19} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    // paddingHorizontal: 16,
  },
  button: {
    backgroundColor: color.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightPercentageToDP(1.8),
    borderRadius: 16,
    gap: 10,
    shadowColor: "#3b5bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default LogoutButton;
