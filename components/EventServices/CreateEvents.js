import { View,  StyleSheet, ScrollView,Text, Pressable, Alert } from 'react-native'
import React, { useState,useEffect } from 'react'
import { updateUserHostJoinEvents } from '../../firebase/firestore';
import { getDoc, doc, addDoc,collection} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextInput } from "react-native-paper";
import Colors from '../../Helper/Colors';
import MyStyle from '../../Helper/MyStyle';
import { auth,firestore,storage } from '../../firebase/firebase-setup';
import { useNavigation } from '@react-navigation/native';
import LocationPicker from '../LocationServices/LocationPicker';
import {Calendar} from 'react-native-calendars';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import {FontAwesome,SimpleLineIcons,Feather} from '@expo/vector-icons';

import {TimePicker} from 'react-native-simple-time-picker';
import PosterPicker from '../ImageServices/PosterPicker';




export default function CreateEvents({route}) {
  const navigation = useNavigation();
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(0);
  const [location, setLocation] = useState("");
  const [quota, setQuota] = useState();
  const [description, setDescription] = useState("");
  const [user,setUser] = useState([]);
  const [calendarVisible,setCalendarVisible] = useState(false);
  const [dateSelected, setDateSelected]=useState(false);
  const [timeSelecterVisible, setTimeSelecterVisible] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [okVisible, setOkVisible] = useState(true);
  const [themeSelected, setThemeSelected] = useState([]);
  const [tmpUri,setTmptUri] = useState("");
  const [newPosteruri, setPosterUri] = useState("https://firebasestorage.googleapis.com/v0/b/meetpuppies-3cb04.appspot.com/o/Puppies%2Fim-413154.jpeg?alt=media&token=5bd3f303-6884-44b1-a4eb-ca28e49a740c");
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    const getUser1 = async () => {
      const userDoc = doc(firestore, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("can't find the user in firestore");
      }
    };
    getUser1();
  }, []);

  useEffect(() => {
    if (route.params) {
      console.log("this is what we return from picker",route.params);
      setLocation({
        latitude: route.params.currentLocation.latitude,
        longitude: route.params.currentLocation.longitude,
        address:route.params.currentAddress,
      });
      console.log("after return's Location, ",location);
    }
  }, [route]);


  const imageHandler = (uri) => {
    setTmptUri(uri);
  };

  const onAdd = async function () {
    if (isNaN(quota)){
      Alert.alert('Quota must be an integer');
      return;
    }
    else if (!Number.isInteger(Number(quota))){
      Alert.alert('Quota must be an integer');
      return; 
    }
    if (theme.length<1 || date.length<1 || time.length<1 ||location.length<1||quota.length<1||description.length<1){
      Alert.alert('Empty input');
      return;
    }
    try{
      const docRef = await addDoc(collection(firestore, "Events"), {
        Theme: theme, Date: date, Time: time, 
        Label:themeSelected,
        postImg:newPosteruri,
        Location:{
          latitude:location.latitude,
          longitude:location.longitude,
          address:location.address,
        }, 
        Quota: Number.parseInt(quota), 
        Description:description, 
        GoingNum:1, 
        Host: auth.currentUser.uid, 
        Attendees:[auth.currentUser.uid]
      });
      
      console.log("Document written with ID: ", docRef.id);
      await updateUserHostJoinEvents(auth.currentUser.uid,docRef.id);}
    catch(err){
      console.log("add new event to db",err);
    }
    navigation.navigate("Discover Events")

  };
  
  const showCalendar=()=>{
    setCalendarVisible(true)
  }
  const handleChange = (newTime)=>{
      setTime(newTime)
      if (newTime.hours<10){setHour("0"+newTime.hours);}
      if (newTime.minutes<10){setMinute("0"+newTime.minutes);}
      if (newTime.hours>=10){setHour(newTime.hours)}
      if (newTime.minutes>=10){setMinute(newTime.minutes)}
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

  const getImage = async (uri) => {
    try {
      console.log("uri in getImage in create event", uri);
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
    let uri = tmpUri;

    try {
      if (uri) {
        try{
          const imageBlob = await getImage(uri);
          const imageName = uri.substring(uri.lastIndexOf("/") + 1);
          const imageRef = ref(storage, `images/${imageName}`);
          const uploadResult = await uploadBytes(imageRef, imageBlob);
          uri = uploadResult.metadata.fullPath;
        }
        catch(err){
          console.log("get uriImage",err);
        }
        const getImage2 = async ()=>{
          try {
            const reference = ref(storage, uri);
            const url = await getDownloadURL(reference);
            setPosterUri(url);
            return url;
          } catch (err) {
            console.log(err);
          }
        }
        try{
        const newurl = await getImage2();
        console.log("newposter uri",newurl);
        Alert.alert("Poster update successfully!");
      }
        catch(err){
          console.log(err);
        }
        //await editAvartar(auth.currentUser.uid, newurl);
     
        
      }
      console.log(uri);
    } catch (err) {
      console.log(err);
    }
  };




  return (
    <ScrollView style={{flex:1}}> 

      <View style={{flex:2}}>
          
          <View>
            <Pressable onPress={showCalendar} style={styles.seleteDateTime}>
              <Text style={styles.text} >Select Date</Text>
            </Pressable>
           
          {calendarVisible && <Calendar
           
            onDayPress={day => {
              setDate(day);
              setCalendarVisible(false)
              setDateSelected(true)
            }}
            />}
            {dateSelected && <Text style={[styles.textInput,{marginLeft:20}]}>Date {date.dateString}</Text>}
          </View>
          <View>
          <Pressable onPress={showTimeSelecter} style={styles.seleteDateTime}>
              <Text style={styles.text} >Select Time</Text>
          </Pressable>
          {timeSelecterVisible && <TimePicker value={time} onChange={handleChange} />}
          
          <View style={styles.timeConfirm}>{timeSelected && <Text style={styles.showTime}>Time {hour}: {minute}</Text>}
          {timeSelected && okVisible && 
          <Pressable onPress={closeTimeSelecter} 
          style={styles.ok}>
            <Text>OK!</Text></Pressable>
          }
          </View>
          </View>

          <View style={{flex:5,margin:10}}>
          <MultipleSelectList 
              setSelected={(val) => setThemeSelected(val)} 
              data={[{key:'1', value:'Puppy Training'},
                  {key:'2', value:'Dog Run Party'},
                  {key:'3', value:'Local Meets'},
                  {key:'4', value:'Treats Party'},]} 
              save="value"
              label="Themes"
              placeholder="Please Select the Labels"
              arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />} 
              searchicon={<FontAwesome name="search" size={12} color={'black'} />}   
          />
          </View>
          <TextInput
              label="Theme"
              style={styles.textInput}
              value={theme}
              onChangeText={(newTheme) => {
                  setTheme(newTheme);
          }}
              mode='outlined'
              outlineColor= {Colors.cardBkg}
              activeOutlineColor ={Colors.cardBkg}
              
          />
          <TextInput
              label = "Quota"
              style={styles.textInput}
              value={quota}
              onChangeText={(newQuota) => {
                  setQuota(newQuota);
          }}
          mode='outlined'
          outlineColor= {Colors.cardBkg}
          activeOutlineColor ={Colors.cardBkg}
          />
          <TextInput
              label = "Description"
              style={styles.textInput}
              value={description}
              onChangeText={(newDescription) => {
                  setDescription(newDescription);
          }}
          mode='outlined'
          outlineColor= {Colors.cardBkg}
          activeOutlineColor ={Colors.cardBkg}
          />

      </View>
        
      <View style={{flex:1,margin:10}}> 
          <LocationPicker user={user}/> 
      </View>
      <View style={{flex:1,margin:10}}> 
        <PosterPicker imageHandler={imageHandler} />
        <View style={{alignItems:"center"}}> 
          <Pressable 
            style={MyStyle.buttoncontainer}
            onPress={onPicAdd}> 
            <View style={{flex:2,justifyContent:"center",alignItems:"center",flexDirection:"row"}}> 
              <Feather name="upload-cloud" size={24} color="#5F8D4E" />
              <Text> Confirm Poster</Text>
            </View> 
          </Pressable>
        </View> 
      </View>
      
      <View> 
        <Pressable onPress={onAdd} style={[styles.confirmBtn,{flexDirection:"row"}]}> 
           
              <View style={{justifyContent:"center"}}> 
                <Text style={{fontSize:16, fontWeight:'bold'}}> Confirm </Text>
              </View>   
        </Pressable>
      </View>
      


    </ScrollView>
  )
}
const styles = StyleSheet.create({

    textInput:{
        padding:0,
        paddingVertical:-5,
        margin:10,
        marginVertical:2,
        fontSize:18,
        borderRadius:15,
        height:40
    },
    seleteDateTime:{
      padding:10,
      backgroundColor: Colors.detailBkg,
      justifyContent:'center',
      alignItems:'center',
      margin:10,
      borderRadius:8,

    },
    text:{
      fontSize:18,
    },
    ok:{
      fontSize:18,
      backgroundColor: Colors.detailBkg,
      justifyContent:'center',
      alignContent:'center',
      padding:5,
      borderRadius:6

    },
    showTime:{
      marginLeft:10,
      marginRight:20,
      padding:5,
      fontSize:18,
    },
    timeConfirm:{
      flexDirection:'row',
    },
    confirmBtn:{
      backgroundColor:"#8BBCCC",
      margin:10,
      alignSelf:'center',
      borderRadius:8,
      padding:10
    }
  });

