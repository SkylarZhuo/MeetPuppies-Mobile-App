import { View, FlatList, Pressable} from 'react-native';
import React, {useEffect,useState} from 'react';
import Attendee from './Attendee';
import { getDoc, doc } from "firebase/firestore";
import { firestore } from '../../firebase/firebase-setup'


export default function ListAllAttendees({attendee,eventID}) {
  const [event,setEvent] = useState([]);
  const [curAttendee,setCurAttendee] = useState(attendee[0]);


  useEffect(() => {
    const getEvent = async () => {
      const eventDoc = doc(firestore, "Events", eventID);
      try{
        const docSnap = await getDoc(eventDoc);
        if (docSnap.exists()) {
          setEvent(docSnap.data());
          setCurAttendee(docSnap.data().Attendees);
        } 
      }
      catch(err){
        console.log(err);
      }
    };
    getEvent();

  }, [eventID]);


  return (
    
      <View style={{flex:1}}> 
        <FlatList
              horizontal={true}
              data={curAttendee}
              renderItem={({ item }) => {
              return (
                <Pressable>
                  <Attendee  AttendeeId={item}/>
                </Pressable>
              );
          }} />
          </View>

  )
}

