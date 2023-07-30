import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import MyStyle from "../Helper/MyStyle";
import Colors from "../Helper/Colors";
import React, { useState, useEffect } from "react";
import { firestore, auth, storage } from "../firebase/firebase-setup";
import { editProfile, editAvartar } from "../firebase/firestore";
import { getDoc, doc } from "firebase/firestore";
import LocationManager from "../components/LocationServices/LocationManager";
import ImageManager from "../components/ImageServices/ImageManager";
import { Alert } from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Feather } from '@expo/vector-icons'; 
import {  useRoute } from "@react-navigation/native";

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [newAvataruri, setAvatarUri] = useState("");
  const [url, setUrl] = useState("");
  const [editInfo, setEditInfo] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const route = useRoute();

  console.log("profile, this is route",route.params);

  useEffect(() => {
    const getUser1 = async () => {
      const userDoc = doc(firestore, "Users", auth.currentUser.uid);
      
      try{const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          console.log("success fetching user");
        } else {
          console.log("can't find the user in firestore");
        }}
      catch(err){
        console.log(err);
      }
    };
    getUser1();
  }, []);

  useEffect(()=>{
    if(route.params){
      setUser({ ...user, Location: {
        latitude:route.params.currentLocation.latitude,
        longitude: route.params.currentLocation.longitude
      }})
    }
  },[route.params]);

  const onEdit = function () {
    console.log("test",route.params);
    editProfile(auth.currentUser.uid, user);
    
  };

  const editProfileHandler = () => {
    onEdit();
    navigation.navigate("Me",{itemObject:user});
    
  };

  const cancelEditProfile = () => {
    navigation.goBack();
  };

  const imageHandler = (uri) => {
    setAvatar(uri);
  };

  const getImage = async (uri) => {
    try {
      console.log("uri in getImage3", uri);
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Image fetch request failed");
      }
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.log(err);
    }
  };

  const onPicAdd = async function () {
    let uri = avatar;

    try {
      if (uri) {
        console.log("22222", uri);
        const imageBlob = await getImage(uri);
        const imageName = uri.substring(uri.lastIndexOf("/") + 1);
        const imageRef = await ref(storage, `images/${imageName}`);
        const uploadResult = await uploadBytes(imageRef, imageBlob);
        uri = uploadResult.metadata.fullPath;

        console.log("3333-------------", uri);
        const getImage2 = async ()=>{
          try {
            const reference = ref(storage, uri);
            const url = await getDownloadURL(reference);
            setUrl(url);
            return url;
          } catch (err) {
            console.log("11111",err);
          }
        }
        const newurl = await getImage2();
        await editAvartar(auth.currentUser.uid, newurl);
          Alert.alert("Avatar update successfully!");

      }
      console.log(uri);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <ScrollView>
      <View style={styles.avatarEdit}>
        <Text style={styles.title}>Edit Personal Infomation</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Username</Text>
        <TextInput
          value={user ? user.userName : ""}
          style={styles.detailInput}
          onChangeText={(txt) => setUser({ ...user, userName: txt })}
        />
      </View> 
      <View style={styles.detailContainer}>
        <LocationManager user={user} />
      </View>

      <View style={{flex:1,alignItems:"center", marginHorizontal:"10%"}}>
        <View style={{flex:1,flexDirection:"row"}}> 
          <Pressable 
            style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center",marginRight:20}]}
            onPress ={cancelEditProfile} > 
            <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
                <Text> Cancel </Text>
                <MaterialIcons name="cancel" size={24} color="white" />
            </View>
          </Pressable>
   
            <Pressable
              onPress={editProfileHandler}
              style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center",marginLeft:20}]}>
                <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
                  <Text> Save </Text>
                  <MaterialIcons name="save-alt" size={24} color="white" />
                </View>
            </Pressable>
            
          </View>
        </View>
        </View>
        <View style={styles.avatarEdit}>
          <Text style={styles.title}>Edit Avatar</Text>
        <View style={styles.avatarEditContainer}>
          <ImageManager user={user} imageHandler={imageHandler} url={url}/>
          
            <Pressable 
              style={styles.buttoncontainer}
              onPress={onPicAdd}> 
              <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
                <Feather name="upload-cloud" size={24} color="#5F8D4E" />
                <Text> Confirm Avatar</Text>
              </View> 
            </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    
  },
  detailContainer: {
    padding: 8,
    marginHorizontal: 5,
    borderBottomWidth: 0.7,
    borderColor: "gray",
  },
  avatarEditContainer:{
    padding: 10, 
  },
  detailTitle: {
    fontSize: 16,
    color: "gray",
    marginVertical: 10,
  },
  detailInput: {
    fontSize: 18,
  },
  btnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  buttoncontainer: {
    padding: 10,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor:Colors.backgroundAll,
    flexDirection: "row",
    color: "white",
  },
  buttconContainer2: {
    borderRadius: 10,
    borderColor: "black",
    padding: 3,
    borderWidth: 2,
    marginTop: 5,
    backgroundColor: "#DEBACE",
  },
  title:{
    fontSize:22,
    marginLeft:10,
    padding:5,
    color:Colors.primary500
  },

  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: "gray",
    borderWidth: 3,
  },
  confirmButton: {
    borderRadius: 10,
    borderColor: "black",
    padding: 3,
    borderWidth: 2,
    marginTop: 5,
    backgroundColor: "#DEBACE",
  },
  avatarEdit:{
    borderWidth:2,
    margin:10,
    borderRadius:10,
    borderColor:Colors.detailBkg

  }
});
