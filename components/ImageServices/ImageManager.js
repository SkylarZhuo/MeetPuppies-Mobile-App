

import { View, Button, StyleSheet, Image, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import MyStyle from "../../Helper/MyStyle";
import { Alert } from "react-native";
import { getStorage,ref,getDownloadURL } from "firebase/storage";
import { Feather,Foundation } from '@expo/vector-icons'; 
export default function ImageManager({ imageHandler, user,url }) {
 
  const [permissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const [avatarUri, setAvatarUri] = useState("");


  const verifyPermission = async () => {
    //check the permissions, if that status is grated...else requestPermission
    if (permissionInfo.granted) {
      return true;
    }
    try{
      const requestPermissionResponse = await requestPermission();
      return requestPermissionResponse.granted;
    }
    catch(err){
      console.log("image permission",err);
    }
    
    
  };
  const takeImageHander = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      setImageUri(result.assets[0]?.uri);
      imageHandler(result.assets[0]?.uri);
    } catch (err) {
      console.log("Upload from camera failed!",err);
    }
  };

  const pickImageHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.1,
        aspect: [4, 3]
      });
      if (!result.canceled) {
        setImageUri(result.assets[0]?.uri);
        imageHandler(result.assets[0]?.uri);
      }
    } catch (err) {
      console.log("Select from gallery failed", err);
    }
  };


  const initial = user.Avatar
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {user.Avatar && !imageUri ? (
          <Image source={{ uri: user.Avatar }} style={styles.avatar} />
        ) : (
          <></>
        )}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <></>
        )}
        {
          ! imageUri && !url && !user.Avatar?
            <View style={styles.avatar}><Text style={styles.editText}>Upload Avatar Here</Text></View>: <></>
        }
        
      </View>
      <View style={styles.buttconContainer}>

        <View style={{marginVertical:10}}> 

          <Pressable 
            style={[MyStyle.buttoncontainer]}
            onPress={pickImageHandler}> 
            <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
              <Foundation name="photo" size={24} color="#5F8D4E" />
              <Text> Select Gallery</Text>
            </View>
          </Pressable>

          <Pressable 
            style={[MyStyle.buttoncontainer,]}
            onPress={takeImageHander}> 
            <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
              <Feather name="camera" size={24} color="#5F8D4E" />
              <Text> Take a Image</Text>
            </View> 
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    height: 200,
    width: 200,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",

  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 200,
    borderColor: "gray",
    //borderWidth: 3,
    backgroundColor: "gray",
  },
  buttconContainer:{
    marginHorizontal: 10
  },
  individualBtn: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "#DEBACE",
    color: "white",
    marginVertical: 10,
  },
  button:{
    color: 'white'
  },
  editText:{
    margin: 40,
    textAlign:"center",
    justifyContent:'center'
  }
});