import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        hidden={false}
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </>
  );
}
