import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
import React,{ useState }  from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-setup";
import LoginButton from "../components/UserServices/LoginButton";
import {  addUserToDB2 } from "../firebase/firestore";
import Colors from "../Helper/Colors"

export default function Signup({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  const handleSignup = async () => {
    // some check here
    if (password.length < 6) {
      Alert.alert("The password needs to be minimum 6 characters");
      return;
    }
    if (password !== confirmpassword) {
      Alert.alert("The password and confirmed password don't match");
      return;
    }
    if(!email.includes("@")){
      Alert.alert("Please input a valid email address!")
      return;
    }
    if(username.length < 3){
      Alert.alert("The username needs to be minimum 3 characters!");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        username,
      );
      const data={
        Avatar: "https://firebasestorage.googleapis.com/v0/b/meetpuppies-3cb04.appspot.com/o/Avatars%2FdogPng.jpeg?alt=media&token=32c4465b-16c3-418e-af9b-1d374417a285",
        Badges: null,
        HostEvents: [],
        JoinEvents: [],
        CollectedEvents:[],
        Location: {
          latitude:0,
          longitude:0
        },
        PuppyImage: null,
        Rewards: 0,
        userEmail: email,
        userName: username,
        uid: auth.currentUser.uid
      }
      addUserToDB2(data)
      //console.log(userCred);
    } catch (err) {
      console.log(err);
    }
  };

 
  

  return (
    <View style={styles.authContent}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create Account</Text>
      </View>
      <View>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={(newEmail) => setEmail(newEmail)}
          value={email}
          keyboardType="email-address"
        />
      </View>
      <View>
        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={(newUsername) => setUsername(newUsername)}
          value={username}
          keyboardType="default"
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(newPass) => setPassword(newPass)}
          value={password}
          placeholder="Password"
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(newPass) => setConfirmPassword(newPass)}
          value={confirmpassword}
          placeholder="Confirm Password"
        />
      </View>

      {/* <Button title="Register" onPress={handleSignup} /> */}

      <LoginButton title="Register" onPress={handleSignup} />
      <Button
        title="Already Registered? Login"
        onPress={() => navigation.replace("Login")}
        color={Colors.titleFontColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  authContent: {
    padding: 16,
    // flex: 1,
    justifyContent: "center",
  },
  titleContainer:{
    marginTop: 130,
    marginBottom: 30
  },
  title: {
    textAlign: "center",
    // color: "#432C7A",
    color: Colors.titleFontColor,
    fontSize:28,
    fontWeight: 'bold'
  },
  inputContainer: {
    marginVertical: 20,
    
  },

  input: {
    borderColor:'gray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    fontSize: 20,
    borderWidth: 2,
    marginVertical:14,
    marginHorizontal: 30
  },
});