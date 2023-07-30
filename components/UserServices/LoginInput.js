import { View, Text,StyleSheet,TextInput } from "react-native";
import React from "react";


export default function LoginInput({ description, ...props }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        // selectionColor="#3F3B6C"
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {description  (
        <Text style={styles.description}>{description}</Text>
      ) }
      { <Text style={styles.error}>{errorText}</Text> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: "#F5D5AE",
  },
  description: {
    fontSize: 13,
    color:"#EFF5F5",
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: "#EFF5F5",
    paddingTop: 8,
  },
});
