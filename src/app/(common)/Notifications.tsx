import React from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OuterContainer from '@/src/styles/OuterContainer';
import CommonHeader from '@/src/component/Header/CommonHeader';
import TextBold from '@/src/styles/TextBold';
import TextNormal from '@/src/styles/TextNormal';
import { spacing } from '@/src/styles/Spacing';
import { Bell } from 'lucide-react-native';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  buttonLabel: string;
  isNew?: boolean;
};

const DATA = [
  {
    title: 'Today',
    newCount: 2,
    data: [
      {
        id: '1',
        title: 'New Ride Assigned',
        message:
          'You have been assigned a ride from [Pick-up Location] to [Drop-off Location]',
        time: '3:02 PM',
        buttonLabel: 'View Ride Details',
        isNew: true,
      },
      {
        id: '2',
        title: 'Ride Cancelled',
        message:
          'The ride from [Pick-up Location] to [Drop-off Location] has been canceled.',
        time: '3:02 PM',
        buttonLabel: 'View Ride History',
        isNew: true,
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        title: 'Ride Completed',
        message:
          'You have successfully completed the ride from [Pick-up Location] to [Drop-off Location].',
        time: '3:02 PM',
        buttonLabel: 'View Earnings',
      },
    ],
  },
];

const NotificationScreen: React.FC = () => {
  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Bell size={20} color="#3B82F6" />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <TextBold style={styles.title}>{item.title}</TextBold>
            <View style={styles.timeWrap}>
              <TextNormal style={styles.time}>{item.time}</TextNormal>
              {item.isNew && <View style={styles.dot} />}
            </View>
          </View>
          <TextNormal style={styles.message}>{item.message}</TextNormal>
          <TouchableOpacity style={styles.button}>
            <TextNormal style={styles.buttonText}>{item.buttonLabel}</TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; newCount?: number };
  }) => (
    <View style={styles.sectionHeader}>
      <TextBold style={styles.sectionTitle}>{section.title}</TextBold>
      {section.newCount && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{section.newCount} New</Text>
        </View>
      )}
    </View>
  );

  return (
    <OuterContainer>
      <CommonHeader title="Notification" />
      <SectionList
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingBottom: hp(2) }}
      />
    </OuterContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: hp(2),
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: spacing.sm,
    paddingVertical: hp(0.3),
    borderRadius: spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: hp(1.4),
  },
  card: {
    backgroundColor: '#F9FBFF',
    marginVertical: hp(1),
    paddingVertical: spacing.xl,
    borderRadius: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
  },
  iconWrap: {
    backgroundColor: 'white',
    padding: hp(1.2),
    borderRadius: 999,
    marginRight: spacing.md,
    alignSelf: 'flex-start',
    elevation:2,
    marginLeft:hp(0.5)
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: hp(1.9),
    flexShrink: 1,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd:hp(1)
  },
  time: {
    fontSize: hp(1.5),
    color: '#6B7280',
  },
  dot: {
    width: hp(1),
    height: hp(1),
    backgroundColor: '#EF4444',
    borderRadius: 999,
    marginLeft: hp(0.5),
  },
  message: {
    fontSize: hp(1.5),
    color: '#6B7280',
    marginVertical: hp(0.7),
    paddingEnd:hp(1)
  },
  button: {
    marginTop: hp(1.4),
    backgroundColor: '#fff',
    paddingVertical: hp(0.7),
    paddingHorizontal:hp(1),
    borderRadius: spacing.sm,
    alignItems: 'center',
    alignSelf:'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: hp(1.6),
    color: '#111827',
  },
});
