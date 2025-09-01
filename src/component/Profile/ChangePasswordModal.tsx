import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextNormal from '@/src/styles/TextNormal';
import { color } from '@/src/constants/colors';

const ChangePasswordModal = ({ visiblePass, onClose }: { visiblePass: boolean; onClose: () => void }) => {
  return (
    <Modal transparent animationType="fade" visible={visiblePass}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextNormal style={styles.title}>Change Password</TextNormal>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput placeholder="Current password" style={styles.input} keyboardType="visible-password"   />
          <TextInput placeholder="New Password" style={styles.input} keyboardType="visible-password" />

          <TouchableOpacity style={styles.button}>
            <TextNormal style={styles.buttonText}>Save</TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor:color.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangePasswordModal;
