import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  Button,
  Image,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase/firebase-setup";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginButton from "../components/UserServices/LoginButton";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Helper/Colors";


export default function Login({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (err) {
      Alert.alert("The Email or the Password is incorrect!");
      console.log(err.message);
    }
  };
  return (
    <View style={styles.authContent}>
      <View style={styles.imageContainer}>
        {/* <Image
          source={require("../assets/draftlogo3.png")}
          style={styles.image}
        ></Image> */}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
      </View>
      <View>
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={(newEmail) => setEmail(newEmail)}
            value={email}
            keyboardType="email-address"
          />
          {/* <MaterialIcons name="email" size={24} color="black" /> */}
      </View>
      <View>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(newPass) => setPassword(newPass)}
            value={password}
            placeholder="Password"
          />
          
          {/* <MaterialCommunityIcons
            style={styles.loginIcon}
            name="form-textbox-password"
            size={24}
            color="black"
          /> */}
      </View>
      <View style={styles.button}>
        {/* <Button title="Log In" onPress={handleLogin} /> */}
        <LoginButton title="Log in" onPress={handleLogin} />
      </View>
      <View style={styles.button}>
        <Button
          title="New User? Create an account"
          onPress={() => navigation.replace("Signup")}
          color={Colors.titleFontColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  authContent: {
    padding: 16,
    // flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignContent: "center",
    marginTop: 20,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 400 / 2,
    marginRight: 95,
    marginLeft: 110,
  },
  titleContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    color: Colors.titleFontColor,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60
  },

  inputContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  userInputContainer:{
    flexDirection:'row',
  },
  input: {
    borderColor: "gray",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    fontSize: 20,
    borderWidth: 2,
    marginVertical: 14,
    marginHorizontal: 30,
  },
  button: {
    marginTop: 5,
  },
  loginIcon:{
    padding: 20
  }
});
