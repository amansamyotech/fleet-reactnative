import RideList from "@/src/component/RideTimeLine/RideList";
import { color } from "@/src/constants/colors";
import { spacing } from "@/src/styles/Spacing";
import TextNormal from "@/src/styles/TextNormal";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

type FilterOption = "All" | "This Month" | "Last Month" | "Custom";
type TabOption = "upcoming" | "completed";

const RideTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("upcoming");
  const options: FilterOption[] = ["All", "This Month", "Last Month", "Custom"];
  const [selected, setSelected] = useState<FilterOption>("All");

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabContainer}>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "upcoming" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            <TextNormal style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
              Upcoming Rides
            </TextNormal>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "completed" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("completed")}
          >
            <TextNormal style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
              Completed Rides
            </TextNormal>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "completed" && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selected === option && styles.selectedButton,
              ]}
              onPress={() => setSelected(option)}
            >
              <TextNormal
                style={[
                  styles.optionText,
                  selected === option && styles.selectedText,
                ]}
              >
                {option}
              </TextNormal>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {activeTab === "upcoming" && (
        <View style={styles.spacer}></View>
      )}
      
      <RideList activeTab={activeTab} filterOption={selected} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  tabContainer: {
    backgroundColor: '#F2F2F2',
    marginTop: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtons: {
    flexDirection: "row",
    borderRadius: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: wp(9.3),
    borderRadius: spacing.xxl,
  },
  activeTab: {
    backgroundColor: color.primary,
  },
  tabText: {
    fontSize: hp(1.6),
    color: "#1F2937",
    fontWeight: "700",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: 10,
    gap: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: color.primary,
  },
  optionText: {
    color: color.labelColor,
    fontWeight: "500",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  spacer: {
    marginTop: hp(2),
  }
});

export default RideTimeline;