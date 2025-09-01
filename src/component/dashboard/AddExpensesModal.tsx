import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextNormal from '@/src/styles/TextNormal';
import { color } from '@/src/constants/colors';
import { BookingsContext } from '@/src/app/(main)/(home)';
import rideTimelineServices from '@/src/api/services/main/rideTimelineServices';


const AddExpenseModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { bookings } = useContext(BookingsContext);
  const booking = bookings.length > 0 ? bookings[0] : undefined;
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const resetForm = () => {
    setAmount('');
    setDescription('');
  };
  
  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Input', 'Please enter a valid amount');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Invalid Input', 'Please enter a description');
      return false;
    }
    
    if (!booking?.id) {
      Alert.alert('Error', 'No active booking found');
      return false;
    }
    
    return true;
  };

  const handleAddExpense = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const response = await rideTimelineServices.saveExpense({
        bookingId: booking!.id,
        amount: parseFloat(amount),
        description: description.trim()
      });
      
      if (response.success) {
        Alert.alert('Success', 'Expense added successfully');
        resetForm();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextNormal style={styles.title}>Add Expenses</TextNormal>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput 
            placeholder="Amount" 
            style={styles.input} 
            keyboardType="numeric" 
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.textArea]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAddExpense}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <TextNormal style={styles.buttonText}>Add Expenses</TextNormal>
            )}
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
    backgroundColor: color.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: color.primary + '80', // Adding opacity
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddExpenseModal;