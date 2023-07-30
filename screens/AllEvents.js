import React,{useState,useEffect} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { firestore } from '../firebase/firebase-setup';
import { collection, onSnapshot } from 'firebase/firestore';
import MyStyle from '../Helper/MyStyle';
import EventLists from '../components/EventServices/EventLists';


export default function AllEvents({navigation}) {
  const [event, setEvent] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(800).then(() => setRefreshing(false));
  }, []);




  useEffect(() => {
    const showEvents = onSnapshot(
      collection(firestore, "Events"),
      (querySnapshot) => {
        if (querySnapshot.empty) {
            setEvent([]);
          return;
        }
        setEvent(
          querySnapshot.docs.map((snapDoc) => {
            let data = snapDoc.data();
            let data1 = { ...data, key: snapDoc.id };
            return data1;
          })
        );
      }
    );
    return () => {
      showEvents();
    };
  }, []);


  
  const eventPressed=(event)=> {
    navigation.navigate("EventDetails",{itemObject:event});
  }


    return (
      <SafeAreaView style={MyStyle.container}>

            
            <View style={MyStyle.bottomContainer}>
              <View style={{flexDirection:"row"}}> 
              <FlatList
                data={event}
                renderItem={({ item }) => {
                  return (
                    <EventLists  event = {item} onEventPress={eventPressed} />
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              ></FlatList>
              </View>
            </View>
        </SafeAreaView>
      );
}