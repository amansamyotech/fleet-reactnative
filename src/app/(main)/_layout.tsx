// app/(main)/_layout.tsx
import useLoginDataStorage from '@/src/hooks/customStorageHook';
import { Tabs, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { color } from '@/src/constants/colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MainTabsLayout() {
  const { loginData } = useLoginDataStorage();
  useEffect(() => {
    if (!loginData) {
      <Redirect href={"/(auth)/(login)"} />
    }
  }, [loginData])
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#3461FD",
       tabBarStyle:{
        height: hp(7),
       },
      tabBarIcon: ({ color, focused }) => {
        if (route.name === "(home)/index") {
          return (
            <Feather name="home" size={24} color={color} />
          );
        } else if (route.name === "(rideTimeline)/index") {
          return (
            <Ionicons name="time-outline" size={24} color={color} />
          );
        } else if (route.name === "(profile)/index") {
          return (
            <Feather name="user" size={24} color={color} />
          );
        }
        return null;
      },
    })}>
      <Tabs.Screen name="(home)/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="(rideTimeline)/index" options={{ title: 'Timeline' }} />
      <Tabs.Screen name="(profile)/index" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
