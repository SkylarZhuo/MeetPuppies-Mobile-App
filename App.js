import { StyleSheet,LogBox} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react"; 
import { onAuthStateChanged,signOut  } from "firebase/auth";
import { auth } from './firebase/firebase-setup';
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import TabScreen from "./screens/TabScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import LoginTemplate from "./screens/LoginTemplate";


import EditEvents from "./components/EventServices/EditEvents";
import EventDetails from "./components/EventServices/EventDetails";
import ListAllAttendees from "./components/UserServices/ListAllAttendees";
import OtherUserAccount from "./components/UserServices/OtherUserAccount";
import Map from "./components/LocationServices/Map";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs([
  "Overwriting fontFamily style attribute preprocessor"]);
  
LogBox.ignoreLogs([
    `Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead`]);  
    
import Colors from "./Helper/Colors";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})


export default function App({navigation}) {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });
  });
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const AuthStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.cardBkg },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize:22
          },
        }}
      >
        <Stack.Screen name=" " component={LoginTemplate}/>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    );
  };

  const AppStack = () => {
    return (

      <Stack.Navigator 
        screenOptions={{
        headerStyle: { backgroundColor: Colors.cardBkg },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize:22
        },
    }}
      >
      <Stack.Screen
        name="Tab"
        component={TabScreen}
        options={{
          headerShown: false,
        }}
      />

        <Stack.Screen 
          name = "Edit My Profile"
          component={EditProfileScreen}
        />
     
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        screenOptions={{
          headerShown: false,
        }}
      />




      <Stack.Screen
        name="ListAllAttendees"
        component={ListAllAttendees}
        screenOptions={{
          headerShown:false
        }}/>

      <Stack.Screen
        name="OtherUser"
        component={OtherUserAccount}
        screenOptions={{
          headerShown:false
        }}/>
  
      

      <Stack.Screen
        name="EditEvents"
        component={EditEvents}
      />  

      
      <Stack.Screen
        name = "Map"
        component={Map}
      />


      </Stack.Navigator>
      )
  }
  return (

    <NavigationContainer>
      {isUserAuthenticated? AppStack() : AuthStack()}
    </NavigationContainer>

      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});