import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface AppTextProps extends TextProps {}

const TextSemiBold: React.FC<AppTextProps> = ({ style, children, ...props }) => {
  return <Text style={[styles.default, style]} {...props}>{children}</Text>;
};

const styles = StyleSheet.create({
  default: {
    fontFamily: "DMSansRegular",
  },
});

export default TextSemiBold;
