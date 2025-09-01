import { color } from "@/src/constants/colors";
import TextBold from "@/src/styles/TextBold";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { heightPercentageToDP as hp} from "react-native-responsive-screen";

interface Props {
  color: string;
  title: string;
  address: string;
  isLast: boolean;
}

const TimelineItem: React.FC<Props> = ({ color, title, address, isLast }) => {
  return (
    <View style={styles.row}>
      <View style={styles.dotColumn}>
        <View style={[styles.dot, { backgroundColor: color,
        borderColor: color === "red" ? 'rgba(255, 77, 73, 0.2)' : "rgba(102, 108, 255, 0.2)", }]} />
        {!isLast && <View style={styles.verticalLine} />}
      </View>
      <View style={styles.textContainer}>
        <TextBold style={styles.title}>{title}</TextBold>
        <TextBold style={styles.address}>{address}</TextBold>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    // paddingVertical: hp(1.5),
    
  },
  dotColumn: {
    width: 30,
    height: hp(7),
    alignItems: "center",

  },
  dot: {
    height: hp(1.8),
    width: hp(1.8),
    borderRadius: hp(1),
    marginTop: 4,
    borderWidth:3
  },
  verticalLine: {
    flex: 1,
    width: 1,
    backgroundColor:"rgba(76, 78, 100, 0.12)",
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 4,
   
  },
  title: {
    fontWeight: "600",
    marginBottom: 2,
  },
  address: {
    color: color.textSecondary,
    paddingVertical: hp(1),
  },
});

export default TimelineItem;
