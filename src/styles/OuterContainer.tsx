import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

type OuterContainerProps = {
  children?: ReactNode;
};

const OuterContainer: React.FC<OuterContainerProps> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
});

export default OuterContainer;
