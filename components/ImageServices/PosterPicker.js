import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import React, { useState,  } from "react";
import * as ImagePicker from "expo-image-picker";
import MyStyle from "../../Helper/MyStyle";
import { AntDesign } from '@expo/vector-icons'; 


export default function PosterPicker({ imageHandler }) {
  const [permissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const verifyPermission = async () => {
    if (permissionInfo.granted) {
      return true;
    }
    try{
    const requestPermissionResponse = await requestPermission();
    return requestPermissionResponse.granted;}
    catch(err){
      console.log("poster image permission",err);
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


  return (
    <View style={MyStyle.container}>
      
     
      <View style={{flex:1,alignItems:"center"}}>
        <View style={{flex:1,flexDirection:"row"}}> 

            <Pressable 
            style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center"}]}
            onPress={pickImageHandler}
            >
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}> 
                    <AntDesign name="picture" size={24} color="white" />
                </View>
                    <View style={{flex:2,justifyContent:"center",alignItems:"center"}}> 
                    <Text style={{fontSize:14}}> Pick a Image as Poster </Text>
                    </View>    
            </Pressable>

      </View>
      </View>

      <View style={styles.avatarContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) :<></>}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({

  avatarContainer: {
    alignItems: "center",

  },
  avatar: {
    height: 250,
    width: 250,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 3,
    backgroundColor: "gray",
  },
  

});
