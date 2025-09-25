// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import TextNormal from '@/src/styles/TextNormal';
// import { color } from '@/src/constants/colors';

// const ChangePasswordModal = ({ visiblePass, onClose }: { visiblePass: boolean; onClose: () => void }) => {
//   return (
//     <Modal transparent animationType="fade" visible={visiblePass}>
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <TextNormal style={styles.title}>Change Password</TextNormal>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="black" />
//             </TouchableOpacity>
//           </View>

//           <TextInput placeholder="Current password" style={styles.input} keyboardType="visible-password"   />
//           <TextInput placeholder="New Password" style={styles.input} keyboardType="visible-password" />

//           <TouchableOpacity style={styles.button}>
//             <TextNormal style={styles.buttonText}>Save</TextNormal>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '85%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: '#f2f2f2',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   button: {
//     backgroundColor:color.primary,
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default ChangePasswordModal;
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextNormal from "@/src/styles/TextNormal";
import { color } from "@/src/constants/colors";
import profileService from "@/src/api/services/main/profileServices";
import useLoginDataStorage from "@/src/hooks/customStorageHook";

interface ChangePasswordModalProps {
  visiblePass: boolean;
  onClose: () => void;
  onPasswordChanged?: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visiblePass,
  onClose,
  onPasswordChanged,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginData } = useLoginDataStorage();
  const driverId = loginData?.id;
  const token = loginData?.token;

  const handleSave = async (): Promise<void> => {
    try {
      if (!currentPassword.trim() || !newPassword.trim()) {
        Alert.alert("Validation Error", "All fields are required");
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert(
          "Validation Error",
          "Password must be at least 6 characters"
        );
        return;
      }
 
      if (!driverId || !token) {
        Alert.alert("Error", "User data is missing or incomplete");
        return;
      }

      setLoading(true);

      const response = await profileService.changePassword(driverId, {
        oldPassword:currentPassword,
        newPassword,
      });

      if (response.success) {
        Alert.alert("Success", "Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        if (onPasswordChanged) onPasswordChanged();
        onClose();
      } else {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (err: any) {
      console.error("Error updating password:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visiblePass}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TextNormal style={styles.title}>Change Password</TextNormal>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Current Password"
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              placeholder="New Password"
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <TextNormal style={styles.buttonText}>Save</TextNormal>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: color.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ChangePasswordModal;
