import { View, Text, Pressable,Image } from "react-native";
import React,{useState,useEffect} from "react";
import MyStyle from "../../Helper/MyStyle";
import { MaterialCommunityIcons,Fontisto} from '@expo/vector-icons'; 
import { auth } from '../../firebase/firebase-setup'
import { getDoc, doc } from "firebase/firestore";
import { firestore } from '../../firebase/firebase-setup'
import { useNavigation } from '@react-navigation/native';

export default function EventCube({ event }) {

    const [user,setUser] = useState([]);
    const [eventNew,setEventNew] = useState([]);
    const navigation = useNavigation();
    const onEventPress=(eventNew)=> {
        
        navigation.navigate("EventDetails",{itemObject:eventNew[0]});
    } 

    
    useEffect(() => {
        const getUser = async ()=> {

            const userDoc = doc(firestore,"Users",  auth.currentUser.uid);
            try{
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()){
                    setUser(docSnap.data());
                }
                else{
                    console.log("can't find the user in firestore");
                }
            }
            catch(err){console.log(err);}
            
        } 
        getUser();
        setEventNew(event);
       
    },[])


if(eventNew[0]){
    return (

     
        <Pressable
        onPress={() => {
            onEventPress(event);
        }}
        android_ripple={{ color: "#223355", foreground: true }}
        style={(obj) => {
            return obj.pressed && MyStyle.pressedItem;
        }}
    >
    <View style={MyStyle.cubeContainer}>
        <View style={MyStyle.rowContainer}> 
            <View style={[MyStyle.snapTitle,{marginRight:40}]}> 
                <Text style={[MyStyle.snapTextTitle,{fontSize:14}]}> {eventNew[0].Theme}  </Text>
            </View>
        </View>
        <View style={MyStyle.snapImgContainer}>
            {eventNew[0].postImg? <Image
            resizeMode="contain"
            style={MyStyle.snapImg}
                source={{
                    uri: eventNew[0].postImg,
                }}/>:<Image
                resizeMode="contain"
                style={MyStyle.snapImg}
                    source={{
                        uri: "https://images.fnlondon.com/im-413154/?width=959&height=639",
                    }}/>
            }
           
        </View>
        <View style={MyStyle.eventInfoSnap}>
            <View style={MyStyle.eventInfoSnapContent}> 
                <Text style={{fontSize:12}}>{eventNew[0].Description} </Text>
            </View>
            <View style={MyStyle.rowSnapContainer}> 
                <View style={MyStyle.eventInfoSnapDate}> 
                    <Text> <MaterialCommunityIcons name="party-popper" size={18} color="black" /> {eventNew[0].GoingNum}/{eventNew[0].Quota} </Text>
                </View>
            </View>
            { eventNew[0].Date?
            <View style={MyStyle.rowSnapContainer}> 
                <View style={MyStyle.eventInfoSnapNoPeople}> 
                    <Text> <Fontisto name="date" size={18} color="black" /> {eventNew[0].Date.dateString} </Text>
                </View>
            </View> :<></>
            }

        </View> 
    </View>
</Pressable> 
       
  )
}else{
    return (<></>)
}
  
}
