import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OuterContainer from '@/src/styles/OuterContainer';
import CommonHeader from '@/src/component/Header/CommonHeader';
import TextNormal from '@/src/styles/TextNormal';
import TextBold from '@/src/styles/TextBold';
import { spacing } from '@/src/styles/Spacing';

const NotificationPreferences: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(prev => !prev);

  return (
    <OuterContainer>
      <CommonHeader title="Notification Preferences" />
      <View style={styles.section}>
        <TextBold style={styles.title}>Ride Updates</TextBold>
        <View style={styles.row}>
          <TextNormal style={styles.label}>Push notifications</TextNormal>
          <Switch
            trackColor={{ false: '#ccc', true: '#34D399' }}
            thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    </OuterContainer>
  );
};

export default NotificationPreferences;

const styles = StyleSheet.create({
  section: {
    marginTop: hp(4),
  },
  title: {
    fontSize: hp(2),
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: hp(1.6),
   marginTop:hp(1.5)
  },
});
