import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { spacing } from "@/src/styles/Spacing";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import OuterContainer from "@/src/styles/OuterContainer";
import CommonHeader from "@/src/component/Header/CommonHeader";
import TextNormal from "@/src/styles/TextNormal";
import TextBold from "@/src/styles/TextBold";

const TermsAndPrivacy: React.FC = () => {
  return (
    <OuterContainer>
      <CommonHeader title="Driver Software Terms & Conditions" />
      <ScrollView
        style={{ marginTop: hp(3) }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(4) }}
      >
        <TextNormal style={styles.intro}>
          Please review these Terms & Conditions carefully. By using the Driver
          App (“Software”) you agree to the following:
        </TextNormal>

        <Section
          title="1. Acceptance of Terms"
          text="By downloading, installing, or using the Driver App, you accept these Terms. If you do not agree, please uninstall and stop using the App."
        />

        <Section
          title="2. Eligibility & Account"
          text="• You must be an authorized driver for a fleet/company with a valid service agreement.
• Provide accurate personal information and keep it updated.
• You are responsible for safeguarding your login credentials and all activity under your account."
        />

        <Section
          title="3. License & Restrictions"
          text="• We grant a limited, non-exclusive, non-transferable license to use the App solely for fleet operations.
• Do not copy, modify, reverse engineer, sell, or distribute the App or its data."
        />

        <Section
          title="4. App Functionality"
          text="The App may collect and display GPS location, routing, trip data, driving behavior, messages, and document uploads to support dispatch and compliance."
        />

        <Section
          title="5. Data Collection & Privacy"
          text="The App collects location, driving behavior, and device information to support fleet management and safety. Data is handled per the Company Privacy Policy and may be shared with fleet operators or authorities as required by law."
        />

        <Section
          title="6. Driver Responsibilities"
          text="• Use the App only while performing authorized duties.
• Keep your device charged and the App active as required.
• Follow local laws on mobile use while driving.
• Report malfunctions, security issues, or unauthorized access immediately."
        />

        <Section
          title="7. Updates & Availability"
          text="We may push automatic updates or patches. Continuous, error-free operation is not guaranteed."
        />

        <Section
          title="8. Security"
          text="You are responsible for securing your device with a password or biometric lock and for reporting any suspected unauthorized access."
        />

        <Section
          title="9. Termination"
          text="Access may be suspended or terminated at any time for policy violations, misuse, or if the fleet agreement ends. Upon termination, uninstall the App and stop all use."
        />

        <Section
          title="10. Intellectual Property"
          text="All rights, title, and interest in the App and its content remain the property of the Company or its licensors."
        />

        <Section
          title="11. Disclaimers & Limitation of Liability"
          text="The App is provided “as is” without warranties. The Company is not liable for damages arising from errors, outages, or misuse, except as prohibited by law."
        />

        <Section
          title="12. Governing Law"
          text="These Terms are governed by the laws of [Insert State/Country]. Disputes will be resolved through the jurisdiction specified in the Company policy."
        />

        <Section
          title="13. Changes to Terms"
          text="The Company may update these Terms at any time. Continued use after changes constitutes acceptance."
        />

        <TextNormal style={[styles.intro, { marginTop: hp(2) }]}>
          By tapping “I Agree” or continuing to use the Driver App, you confirm
          that you have read, understood, and accepted these Terms & Conditions.
        </TextNormal>
      </ScrollView>
    </OuterContainer>
  );
};

// Reusable section component for cleaner markup
const Section: React.FC<{ title: string; text: string }> = ({
  title,
  text,
}) => (
  <View style={styles.card}>
    <TextBold style={styles.title}>{title}</TextBold>
    <TextNormal style={styles.body}>{text}</TextNormal>
  </View>
);

export default TermsAndPrivacy;

const styles = StyleSheet.create({
  intro: {
    fontSize: hp(1.6),
    color: "#6B7280",
    marginBottom: spacing.lg,
    paddingHorizontal: hp(2),
  },
  card: {
    backgroundColor: "#F9FBFF",
    paddingVertical: spacing.lg,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: hp(2),
  },
  title: {
    fontSize: hp(1.8),
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: hp(1.5),
    color: "#6B7280",
    lineHeight: hp(2.2),
  },
});
