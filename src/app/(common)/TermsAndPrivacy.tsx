import React, { useState } from 'react';
import { View,  StyleSheet } from 'react-native';
import { spacing } from '@/src/styles/Spacing';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import OuterContainer from '@/src/styles/OuterContainer';
import CommonHeader from '@/src/component/Header/CommonHeader';
import TextNormal from '@/src/styles/TextNormal';
import TextBold from '@/src/styles/TextBold';

const TermsAndPrivacy: React.FC = () => {

  return (
    <OuterContainer>
      <CommonHeader title="Terms & Privacy Policy"/>
      <View style={{marginTop:hp(4)}}>
      <TextNormal style={styles.subText}>
      Please review our Terms of Service and Privacy Policy to understand your rights 
      and responsibilities as a driver using our platform. </TextNormal>
      <View style={styles.card}>
       <TextBold style={{fontSize:hp(1.8),paddingHorizontal:hp(2)}}>Terms of Services</TextBold>
       <TextNormal  style={{fontSize:hp(1.4),paddingHorizontal:hp(2), color: '#6B7280',}}>Drivers must comply with traffic lows </TextNormal>
      </View>
      </View>
    </OuterContainer>
  );
};

export default TermsAndPrivacy;

const styles = StyleSheet.create({
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
    gap:spacing.sm
  },
});
