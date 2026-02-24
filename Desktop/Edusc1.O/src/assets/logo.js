import React from "react";
import { View, StyleSheet } from "react-native";

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: "#007AFF",
    borderRadius: 50,
  },
});

export default Logo;
