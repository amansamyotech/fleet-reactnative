import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface AppTextProps extends TextProps {}

const TextBold: React.FC<AppTextProps> = ({ style, children, ...props }) => {
  return <Text style={[styles.default, style]} {...props}>{children}</Text>;
};

const styles = StyleSheet.create({
  default: {
    fontFamily: "LatoBold",
  },
});

export default TextBold;
