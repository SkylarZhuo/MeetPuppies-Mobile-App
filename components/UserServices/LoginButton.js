import { View, Text,StyleSheet,Pressable } from "react-native";
import React from "react";
import Colors from "../../Helper/Colors";

export default function LoginButton({ onPress, mode, style, title, ...props }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.itemPressed}
    >
      {/* <View style={styles.container}> */}
      <View style={mode === "outlined" ? styles.container2 : styles.container}>
        <View style={styles.textContainer}>
          <Text style={mode === "outlined" ? styles.text2 : styles.text}>
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    margin: 30,
    borderRadius: 30,
    // backgroundColor: "#6C4AB6",
    backgroundColor: Colors.cardBkg,
    flexDirection: "row",
    height: 60,
  },
  container2: {
    padding: 5,
    margin: 30,
    borderRadius: 30,
    backgroundColor: "white",
    flexDirection: "row",
    height: 60,
    color: Colors.cardBkg,
  },
  textContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  text2: {
    textAlign: "center",
    color: Colors.cardBkg,
    fontSize: 20,
    fontWeight: "bold",
  },
  flat: {
    backgroundColor: "transparent",
  },
  flatText: {
    color: "#FFFAD7",
  },
  itemPressed: {
    opacity: 0.75,
    // backgroundColor: "#80489C",
    borderRadius: 4,
  },
});
