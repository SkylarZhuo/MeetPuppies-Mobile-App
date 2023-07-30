import { View, Button, StyleSheet,Pressable,Text,Alert } from 'react-native'
import React,{ useState } from 'react'
import { editEvent} from '../../firebase/firestore';
import { TextInput } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Helper/Colors';
import {Calendar} from 'react-native-calendars';
import {TimePicker} from 'react-native-simple-time-picker';
export default function EditEvents({route}) {

  const [calendarVisible,setCalendarVisible] = useState(false);
  const [dateSelected, setDateSelected]=useState(false);
  const [timeSelecterVisible, setTimeSelecterVisible] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [okVisible, setOkVisible] = useState(true);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const showCalendar=()=>{
    setCalendarVisible(true)
  }
  const handleTimeChange = (newTime)=>{
    setEvent({...event,
      Time: newTime,
     })
     setHour(("0"+newTime.hours).slice(-2));
     setMinute(("0"+newTime.minutes).slice(-2));
     setTimeSelected(true)
      
  }
  const showTimeSelecter=()=>{
    setTimeSelecterVisible(true);
    setOkVisible(true)
  }
  const closeTimeSelecter=()=>{
    setTimeSelecterVisible(false);
    setOkVisible(false)
  }
  const navigation = useNavigation();
  const {Key,Theme, Description,Time,Date,Quota,Location} = route.params;
  const [event, setEvent] =useState({
    Theme: Theme,
    Description: Description,
    Time: Time,
    Location: Location,
    Date: Date,
    Quota:Quota
  });


  const onEdit =async()=>{ 
    console.log("before edit", event);
    try{
      await editEvent(Key, event);}
    catch(err){
      console.log("edit event",err);
    }
    console.log("after edit", event);
    navigation.navigate("Tab");
    
  }

  return (
    <View>
        <View>
            <Pressable onPress={showCalendar} style={styles.seleteDateTime}>
              <Text style={styles.text} >Select Date</Text>
            </Pressable>
           
          {calendarVisible && <Calendar
            onDayPress={day => {
              setEvent({...event,
                Date: day,
               });
              setCalendarVisible(false)
              setDateSelected(true)
            }}
            />}
            {dateSelected && <Text style={styles.textInput}>Date {event.Date.dateString}</Text>}
          </View>
          <View>
          <Pressable onPress={showTimeSelecter} style={styles.seleteDateTime}>
              <Text style={styles.text} >Select Time</Text>
          </Pressable>
          {timeSelecterVisible && <TimePicker value={event.Time} onChange={handleTimeChange} />}
          
          <View style={styles.timeConfrim}>{timeSelected && <Text style={styles.showTime}>Time {hour}: {minute}</Text>}
          {timeSelected && okVisible && 
          <Pressable onPress={closeTimeSelecter} 
          style={styles.ok}>
            <Text >OK!</Text></Pressable>
          }
          </View>
        </View>
        <TextInput
            label="Theme"
            style={styles.textInput}
            value={event.Theme}
            onChangeText={(newTheme) => {
                setEvent({...event,
                 Theme: newTheme,
                });
        }}
        mode='outlined'
        outlineColor= {Colors.cardBkg}
        activeOutlineColor ={Colors.cardBkg}
        />
        
        <TextInput
            label = "Description"
            style={styles.textInput}
            value={event.Description}
            onChangeText={(newDescription) => {
                setEvent({...event,Description: newDescription});
        }}
        mode='outlined'
        outlineColor= {Colors.cardBkg}
        activeOutlineColor ={Colors.cardBkg}
        />
      <Button
        title="Confirm"
        onPress={onEdit}
      />  
    </View>
  )
}
const styles = StyleSheet.create({

    textInput:{  
        padding:2,
        margin:10,
        fontSize:18,
        borderRadius: 10,
    },
    seleteDateTime:{
      padding:10,
      backgroundColor: Colors.detailBkg,
      justifyContent:'center',
      margin:10,
      borderRadius:8,
      alignItems:'center'

    },
    text:{
      fontSize:18,
    },
    timeConfrim:{
      flexDirection:'row'
    },
    ok:{
      fontSize:18,
      backgroundColor: Colors.detailBkg,
      justifyContent:'center',
      alignContent:'center',
      padding:5,
      borderRadius:6
    },
    timeConfrim:{
     flexDirection:'row'
    },
    showTime:{
      marginLeft:10,
      marginRight:20,
      padding:5,
      fontSize:18
    },
  });