import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { color } from '@/src/constants/colors'; // adjust path as needed
import { spacing } from '@/src/styles/Spacing';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OuterContainer from '@/src/styles/OuterContainer';
import CommonHeader from '@/src/component/Header/CommonHeader';
import TextNormal from '@/src/styles/TextNormal';

const ContactAdmin: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = () => {
    // Handle form submission here
    console.log({ subject, message });
  };

  return (
    <OuterContainer>
      <CommonHeader title="Contact Admin"/>
      <View style={{marginTop:hp(4)}}>
      <TextNormal style={styles.subText}>
        Need help or have questions? Get in touch with our support team, and we'll assist you with any issues.
      </TextNormal>

      <View style={styles.card}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue:string) => setSubject(itemValue)}
            style={styles.picker}
            dropdownIconColor="gray"
          >
            <Picker.Item label="Subject" value="" />
            <Picker.Item label="Payment Issue" value="payment" />
            <Picker.Item label="Trip Issue" value="trip" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <TextInput
          placeholder="Describe your issue or question here..."
          value={message}
          onChangeText={setMessage}
          style={styles.textArea}
          multiline
          numberOfLines={5}
        />
    
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <TextNormal style={styles.submitText}>Submit</TextNormal>
        </TouchableOpacity>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <FontAwesome name="phone" size={16} color="black" />
          <TextNormal style={styles.contactText}>Contact us -  +1 234 567 890</TextNormal>
        </View>
        <View style={styles.contactRow}>
          <FontAwesome name="envelope" size={16} color="black" />
          <TextNormal style={styles.contactText}>Email us -  Support@cabapp.com</TextNormal>
        </View>
      </View>
      </View>
    </OuterContainer>
  );
};

export default ContactAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    fontSize: hp(2.2),
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  subText: {
    fontSize: hp(1.6),
    color: '#6B7280',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#F9FBFF',
    paddingVertical: spacing.xxl,
    borderRadius: spacing.lg,
    marginVertical: spacing.xxl,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  picker: {
    height: hp(6),
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: spacing.md,
    padding: spacing.sm,
    textAlignVertical: 'top',
    height: hp(15),
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: spacing.sm,
    paddingHorizontal:hp(5),
    borderRadius: spacing.md,
    alignItems: 'center',
    alignSelf:'center'
  },
  submitText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '600',
  },
  contactInfo: {
    marginTop: hp(26),
    alignSelf:'center'
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#fff',
    padding: spacing.sm,
    borderRadius: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  contactText: {
    fontSize: hp(1.7),
    marginLeft: spacing.sm,
  },
});
