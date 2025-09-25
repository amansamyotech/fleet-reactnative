import { useEffect, useState, useRef } from "react";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

// Set notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // required in SDK 49+
    shouldShowList: true,   // required in SDK 49+
  }),
});

// Register device for push notifications
export async function registerForPushAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    Alert.alert("Push notifications require a physical device.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Permission not granted for notifications.");
    return null;
  }

  const token = await Notifications.getDevicePushTokenAsync();
  console.log("👉 FCM Token:", token.data);
  return token.data; // Send this to your backend
}

// Hook to use notifications
export function usePushNotifications() {
  const router =useRouter();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  // useRef type is just 'any', no need to import Subscription
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Register device
    registerForPushAsync().then(setFcmToken);

    // Foreground notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📩 Notification Received:", notification);
      });

    // When user taps notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 User tapped:", response);
        router.push("/(common)/Notifications");
        // navigate to a specific screen if needed
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { fcmToken };
}
