import { View, Text, StyleSheet,Image } from "react-native";
import React from "react";
import LoginButton from "../components/UserServices/LoginButton";
import Colors from "../Helper/Colors";


export default function LoginTemplate({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.Container1}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/logo1.jpg")}
            style={styles.image}
          ></Image>
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MeetPuppies</Text>
      </View>
      <View style={styles.sloganContainer}>
        <Text style={styles.slogan}>Join Events Meet Friends!</Text>
      </View>
      <View>
        <LoginButton
          mode="flat"
          title="LOGIN"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />

        <LoginButton
          mode="outlined"
          title="SIGN UP"
          onPress={() => {
            navigation.navigate("Signup");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container1: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignContent: "center",
    marginTop: 100,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: Colors.titleFontColor
  },
  titleContainer: {
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color:Colors.titleFontColor
  },
  slogan: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 20,
    color:Colors.titleFontColor
  },
});
