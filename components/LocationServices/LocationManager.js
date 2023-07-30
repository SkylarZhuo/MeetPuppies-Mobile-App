import { MaterialIcons } from '@expo/vector-icons'; 
import { View, Image,Text,Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { GMAP_API } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import {  getUser, updateUserGeoLocation} from "../../firebase/firestore";
import MyStyle from "../../Helper/MyStyle";




export default function LocationManager({user}) {
    const navigation = useNavigation();
    const route = useRoute();
    const [permissionResponse, requestPermission] =
      Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [profileLoc,setProfileLoc] = useState(user.Location)

    

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
        if (route.params) {
          
          setLocation({
            latitude: route.params.currentLocation.latitude,
            longitude: route.params.currentLocation.longitude,
          });
          console.log("after return's Location, ",location,route.params.currentLocation.latitude);
        }
      }, [route]);

  
    const PickOnMapHandler = async()=>{
      navigation.navigate("Map", { initialLocation: location });

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
            <View style={{flex:3,justifyContent:"center",alignItems:"center"}}> 
              <Text style={{fontSize:14}}>Choose on Map </Text>
            </View>    
        </Pressable>

        {/* <Pressable 
          style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center",marginLeft:45}]}
          onPress={saveUserLocation}
          >
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}> 
            <MaterialIcons name="save-alt" size={24} color="white" /> 
          </View>
            <View style={{flex:3,justifyContent:"center",alignItems:"center"}}> 
              <Text style={{fontSize:14}} >Save Loc </Text>
            </View>    
        </Pressable> */}
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


      {!route.params && user.Location && location && (
        <> 
        {/* <Text> Lat {user.Location.latitude}</Text>  
        <Text> Long {user.Location.longitude}</Text>   */}
   
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${user.Location.latitude},${user.Location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${user.Location.latitude},${user.Location.longitude}&key=${GMAP_API}`,
          }}
          style={{ width: "100%", height: 200 }}
        />
        </>
      )}



    </View>
  )
}

