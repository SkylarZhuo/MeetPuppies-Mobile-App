import React,{useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {deleteEvent,updateUserJoinEventList,updateEventAttendees,deleteEventInUserHostJoinList} from '../../firebase/firestore'
import { Entypo,Feather,FontAwesome5,MaterialIcons,AntDesign } from '@expo/vector-icons'; 
import MyStyle from '../../Helper/MyStyle';
import { getAuth } from "firebase/auth";
import { GMAP_API } from "@env";
import ListAllAttendees from '../UserServices/ListAllAttendees';
import * as Notifications from "expo-notifications";



export default function EventDetails({route,navigation}) {
  
  const auth = getAuth();
  const curUserUID = String(auth.currentUser.uid).trim();
  const curUser = auth.currentUser;
  const eventHost = route.params.itemObject.Host;
  const [displayText,setDisplayText] = useState("Cancel!");
  const [event,setEvent] = useState([route.params.itemObject]);
  const [attendee,setAttendee] = useState([route.params.itemObject.Attendees]);
  const [goingNum,setGoingNum] = useState(route.params.itemObject.GoingNum);
  const defaultPic = "https://firebasestorage.googleapis.com/v0/b/meetpuppies-3cb04.appspot.com/o/Puppies%2Fim-413154.jpeg?alt=media&token=5bd3f303-6884-44b1-a4eb-ca28e49a740c";
  const defaultMap = "https://firebasestorage.googleapis.com/v0/b/meetpuppies-3cb04.appspot.com/o/Maps%2FScreen%20Shot%202022-11-18%20at%207.27.54%20PM.png?alt=media&token=6f6ecbf9-1db5-4860-a147-e9147136776a";
  const [isShowrealMap,setIsShowRealMap] = useState(false);
  const [isShowRealPoster,setIsShowRealPoster] = useState(false);
  const [hour, setHour] = useState(("00"+route.params.itemObject.Time.hours).slice(-2));
  const [minute, setMinute] = useState(("00"+route.params.itemObject.Time.minutes).slice(-2));
  const editEvent=()=>{
      navigation.navigate('EditEvents',{
      Key: route.params.itemObject.key,
      Time: route.params.itemObject.Time,
      Date: route.params.itemObject.Date,
      Location: route.params.itemObject.Location, 
      Theme: route.params.itemObject.Theme,
      Quota: route.params.itemObject.Quota, 
      Description: route.params.itemObject.Description, 
    })
  }

  const verifyPermission = async () => {
    const permissionStatus = await Notifications.getPermissionsAsync();
  
    if (permissionStatus.granted) {
      return true;
    } else {
      const requestedPermission = await Notifications.requestPermissionsAsync({
        ios: {
          allowBadge: true,
        },
      });
      return requestedPermission.granted;
    }
  };
  
  

    const scheduleConfirmNotificationHandler = async () => {
      try {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          return;
        }
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "So nice to have you!",
            body: "You have successfully join this event!",
            color: "purple",
          },
          trigger:{
              seconds: 2
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    const scheduleCancelNotificationHandler = async () => {
      try {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          return;
        }
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "We are sorry for missing you!",
            body: "You have successfully cancel this event",
            color: "purple",
            
          },
          trigger:{
              seconds: 2
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    const changeText= ()=>{
      if (!attendee[0].includes(curUserUID)){
        setDisplayText("Attend!");
      }else{
        setDisplayText("Cancel!");
      }}

    changeText();
  }, []);



  const showMapHandler =()=>{
   
    setIsShowRealMap(true);
    setIsShowRealPoster(false);
  };

  const showPosterHandler = ()=>{
    
    setIsShowRealPoster(true);
    setIsShowRealMap(false);
  };


  const onDelete =async()=>{
    try{
      await deleteEvent(route.params.itemObject.key);
      await deleteEventInUserHostJoinList(curUserUID,route.params.itemObject.key)}
    catch(err){
      console.log("delete event",err);
    }
  }

  const showAlertDelete = () =>{
    Alert.alert(
        "Important!",
        "Are you sure to delete this?",
        [{ text: "No"},
         {text: "Yes", onPress: () => {
          onDelete();    
          navigation.goBack();
        }
          
        }])
}

  const showAlert = () =>{
    if(displayText==="Cancel!" && goingNum<event[0].Quota){
        Alert.alert(
        "ALERT",
        " Are you sure to cancel?",
        [
          {
            text: "No",
            style: "ok"
          },
          { text: "Confirm", onPress: () => {
            onAttendHandler();
            setGoingNum(goingNum-1);
           
            setDisplayText("Attend!");
            scheduleCancelNotificationHandler()
          } }
        ]
      );
      
    }else{
      Alert.alert(
        "HELLO",
        " Are you ready to Join?",
        [
          {
            text: "Not yet",
          },
          { text: "Sure", onPress: () => {
            onAttendHandler();
            
            setDisplayText("Cancel!");
            setGoingNum(goingNum+1);
            scheduleConfirmNotificationHandler();
          } }
        ]
      );
      
    }
  }



  
  const onAttendHandler= async()=>{
    try{
      await updateUserJoinEventList(curUserUID,route.params.itemObject.key);
      await updateEventAttendees(curUserUID,route.params.itemObject.key);}
    catch(err){
      console.log("attend event",err); 
    }
    console.log("update finished");
  }


  return (
    
    <SafeAreaView style={MyStyle.container}>
      <ScrollView>

      
      <View style={[MyStyle.eventDetailContainer]}> 
          <Text style={styles.text}> <Feather name="info" size={24} color="black" /> {event[0].Theme} </Text>
          <Text style={styles.text}> <Entypo name="calendar" size={24} color="black" /> {event[0].Date.dateString} </Text>
          <Text style={styles.text}> <Entypo name="time-slot" size={24} color="black" /> {hour}: {minute} </Text>

        {
          (route.params.itemObject.Location.address) ?
          <View style={styles.text}>
            <Text style={[{flexWrap:"wrap",fontSize:18}]} > <MaterialIcons name="location-on" size={24} color="black" /> {event[0].Location.address} </Text>
          </View> :
          <View style={[MyStyle.flex1,{flexDirection:"row", marginLeft:14,marginRight:10,alignItems:'center',justifyContent:"center"}]}>
            <Text style={{flexWrap:"wrap",fontSize:18}} > <MaterialIcons name="location-on" size={24} color="black" /> {event[0].Location} </Text>
          </View> 
        }


        <View style={[MyStyle.flex3,{borderWidth:0.7,borderRadius:25,overflow:"hidden"}]}> 

          {
            route.params.itemObject.postImg && !isShowrealMap?
            <Image source={{ uri: route.params.itemObject.postImg}}
            style={{ width: "100%", height: 200 }}
          />:<></>
          }
          { !isShowRealPoster && !isShowrealMap &&!route.params.itemObject.postImg?
            <Image source={{ uri: defaultPic}}
            style={{ width: "100%", height: 200 }}
          />:<></>
          }

          {isShowrealMap && route.params.itemObject.Location.latitude && !isShowRealPoster?
            <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/staticmap?center=${route.params.itemObject.Location.latitude},${route.params.itemObject.Location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${route.params.itemObject.Location.latitude},${route.params.itemObject.Location.longitude}label:L%7C&key=${GMAP_API}`,
            }}
            style={{ width: "100%", height: 200 }}
          />:<></>
          }
          {isShowrealMap && !route.params.itemObject.Location.latitude && !isShowRealPoster?
            <Image
              resizeMode="contain"
              style={{ width: "100%", height: 200 }}
              source={{uri: defaultMap}}/> :<></>
          }

          { isShowRealPoster && !isShowrealMap && !route.params.itemObject.postImg?
            <Image source={{ uri: defaultPic}}
            style={{ width: "100%", height: 200 }}
          />:<></>
          }
          
       
      


        <View style={{flex:1,alignItems:"center", marginHorizontal:"10%",flexDirection:"row"}}>
          <Pressable 
            style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center",marginRight:20}]}
            onPress ={showPosterHandler} > 
            <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
                <Text> Poster </Text>
                
            </View>
          </Pressable>
   
            <Pressable
              onPress={showMapHandler}
              style={[MyStyle.buttoncontainer,{flex:1,justifyContent:"center",marginLeft:20}]}>
                <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
                  <Text> Map </Text>
                </View>
            </Pressable>
        </View>
        </View>
      


        
          <Text style={styles.text}> <FontAwesome5 name="dog" size={24} color="black" /> {goingNum}/{event[0].Quota}  Registered </Text>
       

        
        <View style={[MyStyle.rowContainer,{flexDirection:"column"}]}>
          
          <Text style={styles.text}> <AntDesign name="addusergroup" size={26} color="black" />  Attendees:  </Text>
          <View style={{flex:1,alignItems:"flex-start",flexDirection:"row"}}> 
            <ListAllAttendees attendee={attendee} eventID={route.params.itemObject.key}/>
          </View>
        </View>

       
        <View style={styles.row}>
            {curUser.uid === eventHost && 
            <Pressable style={MyStyle.AttendArea} onPress = {editEvent}>
               <Text style={styles.button}> Edit </Text>
            </Pressable>}
            {curUser.uid === eventHost && <Pressable style={MyStyle.AttendArea} onPress = {showAlertDelete}>
              <Text style={styles.button}> Delete </Text>
            </Pressable>}
            {curUser.uid !== eventHost && <Pressable style={MyStyle.AttendArea} onPress ={()=>{showAlert()}}>
              <Text style={styles.button}> {displayText} </Text>
            </Pressable>}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
    
  )

}
const styles = StyleSheet.create({
  text:{
    fontSize:18,
    margin:5,
    padding:5,
  },
  button:{
    fontSize:20,
    fontWeight:"bold",
    color:"#285430",
    padding:10,
    alignSelf:'center',
    
  },
  row:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }
})