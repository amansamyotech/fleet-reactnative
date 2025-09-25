
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import OuterContainer from "@/src/styles/OuterContainer";
import CommonHeader from "@/src/component/Header/CommonHeader";
import TextBold from "@/src/styles/TextBold";
import TextNormal from "@/src/styles/TextNormal";
import { spacing } from "@/src/styles/Spacing";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import notificationService, {
  Notification,
} from "@/src/api/services/main/notificationservice";
import useLoginDataStorage from "@/src/hooks/customStorageHook";

type SectionData = {
  title: string;
  data: Notification[];
  newCount?: number;
};

const NotificationScreen: React.FC = () => {
  const { loginData } = useLoginDataStorage();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    if (!loginData?.id) return;
    setLoading(true);
    try {
      const res = await notificationService.getNotifications(1, 50, loginData.id);

      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      const todayData = res.data.items.filter(
        (n: Notification) => new Date(n.sentAt).toDateString() === today
      );
      const yesterdayData = res.data.items.filter(
        (n: Notification) => new Date(n.sentAt).toDateString() === yesterday
      );
      const olderData = res.data.items.filter(
        (n: Notification) =>
          !todayData.includes(n) && !yesterdayData.includes(n)
      );

      const grouped: SectionData[] = [];
      if (todayData.length)
        grouped.push({
          title: "Today",
          data: todayData,
          newCount: todayData.filter((x: Notification) => !x.isRead).length,
        });
      if (yesterdayData.length)
        grouped.push({
          title: "Yesterday",
          data: yesterdayData,
          newCount: yesterdayData.filter((x:Notification) => !x.isRead).length,
        });
      if (olderData.length)
        grouped.push({
          title: "Older",
          data: olderData,
          newCount: olderData.filter((x:Notification) => !x.isRead).length,
        });

      setSections(grouped);
    } catch (err) {
      console.log("Error fetching notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loginData?.id]);

  useEffect(() => {
    if (loginData?.id) fetchNotifications();
  }, [loginData?.id]);

  const handlePress = async (item: Notification) => {
    setSelected(item);
    setModalVisible(true);
    if (!item.isRead) {
      await notificationService.markAsRead([item.id]);
      fetchNotifications();
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Bell size={20} color="#3B82F6" />
          </View>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <TextBold style={styles.title}>{item.title}</TextBold>
              <View style={styles.timeWrap}>
                <TextNormal style={styles.time}>
                  {new Date(item.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TextNormal>
                {!item.isRead && <View style={styles.dot} />}
              </View>
            </View>
            <TextNormal style={styles.message} numberOfLines={2}>
              {item.body}
            </TextNormal>         
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; newCount?: number };
  }) => (
    <View style={styles.sectionHeader}>
      <TextBold style={styles.sectionTitle}>{section.title}</TextBold>
      {section.newCount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{section.newCount} New</Text>
        </View>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <OuterContainer>
        <CommonHeader title="Notification" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </OuterContainer>
    );
  }

  return (
    <OuterContainer>
      <CommonHeader title="Notification" />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingBottom: hp(2) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchNotifications();
            }}
          />
        }
      />

      {/* Modal for full message */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <TextBold style={styles.modalTitle}>{selected?.title}</TextBold>
            <TextNormal style={styles.modalBody}>{selected?.body}</TextNormal>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </OuterContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: hp(2),
  },
  badge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: spacing.sm,
    paddingVertical: hp(0.3),
    borderRadius: spacing.sm,
  },
  badgeText: {
    color: "#fff",
    fontSize: hp(1.4),
  },
  card: {
    backgroundColor: "#F9FBFF",
    marginVertical: hp(1),
    paddingVertical: spacing.xl,
    borderRadius: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
  },
  iconWrap: {
    backgroundColor: "white",
    padding: hp(1.2),
    borderRadius: 999,
    marginRight: spacing.md,
    alignSelf: "flex-start",
    elevation: 2,
    marginLeft: hp(0.5),
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: hp(1.9),
    flexShrink: 1,
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: hp(1),
  },
  time: {
    fontSize: hp(1.5),
    color: "#6B7280",
  },
  dot: {
    width: hp(1),
    height: hp(1),
    backgroundColor: "#EF4444",
    borderRadius: 999,
    marginLeft: hp(0.5),
  },
  message: {
    fontSize: hp(1.5),
    color: "#6B7280",
    marginVertical: hp(0.7),
    paddingEnd: hp(1),
  },
  button: {
    marginTop: hp(1.4),
    backgroundColor: "#fff",
    paddingVertical: hp(0.7),
    paddingHorizontal: hp(1),
    borderRadius: spacing.sm,
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: hp(1.6),
    color: "#111827",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: hp(2),
    fontWeight: "bold",
    marginBottom: hp(1),
  },
  modalBody: {
    fontSize: hp(1.8),
    marginBottom: hp(2),
    color: "#374151",
  },
  closeBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});
