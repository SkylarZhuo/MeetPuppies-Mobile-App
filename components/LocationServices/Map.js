import React, { useState,useEffect } from "react";
import { StyleSheet, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";



export default function Map({ route, navigation }) {
 
  const [currentLocation, setCurrentLocation] = useState(route.params.initialLocation.Location);
  const [newAddress,setNewAddress] = useState(null);
  console.log("navigation",route.params)


  const mapPressed = (event) => {

    setCurrentLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  useEffect(() => {
    const getAddress = async()=>{
      const newlatitude = currentLocation.latitude;
      const newlongitude =  currentLocation.longitude;      
      try{
        let response =  await Location.reverseGeocodeAsync({ latitude: newlatitude,longitude: newlongitude});
        let address = `${response[0].name}, ${response[0].street}, ${response[0].postalCode}, ${response[0].city}`;
        setNewAddress(address)}
      catch(err){
        console.log(err);
      }
    }
    getAddress();
  }, [currentLocation]);




  const confirmHandler = async() => {

    if (route.params.path=="eventEdit"){
      navigation.navigate("Create Events", { currentLocation: currentLocation,currentAddress:newAddress });
      console.log("backto create event page");
    }else{
      navigation.navigate("Edit My Profile", { currentLocation: currentLocation });
    }
    
  };
  return (
    <>
      <MapView
        onPress={mapPressed}
        style={styles.map}
        initialRegion={{
          latitude: route.params.initialLocation.Location
            ? route.params.initialLocation.Location.latitude
            : 37.78825,
          longitude: route.params.initialLocation.Location
            ? route.params.initialLocation.Location.longitude
            : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentLocation && <Marker coordinate={currentLocation} />}
      </MapView>
      <Button
        disabled={!currentLocation}
        title="Confirm Selected Location"
        onPress={confirmHandler}
      />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    // flex: 1,
    height: "80%",
  },
});