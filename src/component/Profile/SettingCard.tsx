import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, Entypo, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import TextNormal from "@/src/styles/TextNormal";
import { color } from "@/src/constants/colors";
import { heightPercentageToDP as hp} from "react-native-responsive-screen";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from 'expo-router';

const settingsData = [
  {
    title: "Edit Profile Info",
    icon: <Feather name="edit" size={18} color="#555" />,
  },
  {
    title: "Change Password",
    icon: <Entypo name="lock" size={18} color="#555" />,
  },
  {
    title: "Notification Preferences",
    icon: <Feather name="bell" size={18} color="#555" />,
  },
  {
    title: "Contact Admin",
    icon: <Feather name="phone-call" size={18} color="#555" />,
  },
  {
    title: "Terms & Privacy Policy",
    icon: <MaterialIcons name="description" size={18} color="#555" />,
  },
];

type SettingItem = {
  title: string;
};

const SettingCard = () => {
   const [visible, setVisible] = useState(false);
   const [visiblePass, setVisiblePass] = useState(false);
   const router = useRouter();

  const handleSetting = (item:SettingItem) => {
    if(item.title === "Edit Profile Info"){
      setVisible(true);
    }
    if(item.title === "Change Password"){
      setVisiblePass(true);
    }
    if(item.title === "Contact Admin"){
     router.push('/(common)/ContactAdmin')
    }
    if(item.title === 'Terms & Privacy Policy'){
      router.push('/(common)/TermsAndPrivacy')
    }
    if(item.title === 'Notification Preferences'){
      router.push('/(common)/NotificationPreferences')
    }
  };
  return (
    <View style={styles.container}>
      <TextNormal style={styles.heading}>Settings</TextNormal>
      {settingsData.map((item, index) => (
        <TouchableOpacity  onPress={()=>handleSetting(item)} key={index} style={styles.item}>
          <View style={styles.itemLeft}>
            {item.icon}
            <TextNormal style={styles.itemText}>{item.title}</TextNormal>
          </View>
          <Feather name="chevron-right" size={18} color="black" />
        </TouchableOpacity>
      ))}
          <EditProfileModal visible={visible} onClose={() => setVisible(false)}/>
          <ChangePasswordModal visiblePass={visiblePass} onClose={() => setVisiblePass(false)} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    marginTop: 50,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: hp(1.9),
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(2),
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
  },
});

export default SettingCard;
