import { Text,StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '../components/UserServices/Account';
import CreateEvents from '../components/EventServices/CreateEvents';
import AllEvents from './AllEvents';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase-setup';
export default function TabScreen() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
        screenOptions={({ route,navigation }) => ({
            tabBarShowLabel:true,
            tabBarLabelPosition: "below-icon",
            tabBarIcon: () => {
              let iconName;
              if (route.name === 'Create Events') {
                iconName = <Entypo name="plus" size={20} color="black" />
              } else if (route.name === 'Discover Events') {
                iconName= <Entypo name="home" size={20} color="black" />
              } else if (route.name === 'Me') {
                iconName = <MaterialCommunityIcons name="account" size={20} color="black" />
              }
              return <Text> {iconName}</Text>
            },
            headerShown: true,
            headerStyle: { 
              backgroundColor: "#C8DBBE",
            },
            headerTitleStyle: {
              fontSize:22
            },
            tabBarActiveTintColor:"#39AEA9",
    
          })}
    >
        {/* This should be discover events screen from Jesse */}
        <Tab.Screen name="Discover Events" component={AllEvents}  />
        <Tab.Screen name="Create Events" component={CreateEvents} />
        <Tab.Screen name="Me" component={Account} 
         options = {{
          headerRight: () => (
            <FontAwesome name="sign-out" size={25} color="white" style={styles.logout} onPress={() => signOut(auth)}/>)
        }}
        
        />
    
    </Tab.Navigator>


  )
}

const styles = StyleSheet.create({
    logout:{
        margin:5,
    }
  });