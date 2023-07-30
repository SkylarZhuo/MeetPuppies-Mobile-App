import { MaterialIcons } from '@expo/vector-icons'; 
import { View,Text,Pressable,Image} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import {  getUser, updateUserGeoLocation} from "../../firebase/firestore";
import MyStyle from "../../Helper/MyStyle";
import { GMAP_API } from "@env";



export default function LocationPicker({user}) {
    const navigation = useNavigation();
    const route = useRoute();
    const [permissionResponse, requestPermission] =
      Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [profileLoc,setProfileLoc] = useState();
    const [address,setAddress] = useState("");
    

    useEffect(() => {
        async function getUserLocation() {
          try {
            const storedLocation = await getUser();
            setLocation(storedLocation);
            
          } catch (err) {
            console.log("get user ", err);
          }
        }
        getUserLocation();
      }, []);




    useEffect(() => {
      async function ReverseGeoCode(){
        if (route.params){
          try{
            const newlatitude = route.params.currentLocation.latitude;
            const newlongitude =  route.params.currentLocation.longitude;
            const newAddress = route.params.currentAddress;
            
            setAddress(newAddress);
            setLocation({
              latitude: newlatitude,
              longitude: newlongitude,
              address:address,
            });
          }
        catch(e){
            console.log(e);
          }
        }
      }
        ReverseGeoCode();
        console.log("new lat long add, ", location);
      }, [route]);

    const verifyPermission = async () => {
      if (permissionResponse.granted) {
        return true;
      }
      const requestPermissionResponse = await requestPermission();
      return requestPermissionResponse.granted;
    };



    const PickOnMapHandler = async()=>{
      navigation.navigate("Map", {initialLocation: location,path:"eventEdit"});

    }
    const saveUserLocation = async () => {
      await updateUserGeoLocation(user.uid,location.latitude,location.longitude)
      setProfileLoc({latitude:location.latitude,longitude:location.longitude});
      console.log("finished the location update");
    };
      
  return (
    <View style={{flex:1,alignItems:"center"}}>
      <View style={{flex:1,flexDirection:"row"}}> 

        <Pressable 
          style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center"}]}
          onPress={PickOnMapHandler}
          >
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}> 
            <MaterialIcons name="add-location-alt" size={24} color="white" /> 
          </View>
            <View style={{flex:2,justifyContent:"center",alignItems:"center"}}> 
              <Text style={{fontSize:14}}> Pick a Location </Text>
            </View>    
        </Pressable>

      </View>

{route.params?
      <> 
      <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${route.params.currentLocation.latitude},${route.params.currentLocation.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${route.params.currentLocation.latitude},${route.params.currentLocation.latitude}label:L%7C&key=${GMAP_API}`,
          }}
          style={{ width: "100%", height: 200 }}
        />
      </>
      
      : <></>
    }
{route.params?
  <View style={{flex:2}}>
        <Text style={{fontSize:14}}> {route.params.currentAddress}</Text>

      </View> :<></>

}


    </View>
  )
}
