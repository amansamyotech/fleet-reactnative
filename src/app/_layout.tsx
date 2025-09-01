import { Slot } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        hidden={false}
        translucent={false}
        barStyle="dark-content" 
        backgroundColor="#ffffff"
      />
      <Slot />
    </>
  );
}

