import { View, Text, Pressable,Image, FlatList,ActivityIndicator } from "react-native";
import React,{useState,useEffect,useLayoutEffect} from "react";
import MyStyle from "../../Helper/MyStyle";
import { MaterialCommunityIcons,Fontisto,Entypo,AntDesign,Octicons} from '@expo/vector-icons'; 
import { auth,firestore } from '../../firebase/firebase-setup'
import { getDoc, doc } from "firebase/firestore";
import {updateCollectedEvents} from '../../firebase/firestore';
import ShowLabels from "./ShowLabels";
import geolib,{ getDistance,convertDistance } from "geolib"
import LoadingComp from "../LocationServices/LoadingComp";

export default function EventLists({ event, onEventPress }) {
    const [isCollected,setCollected] = useState(null);
    const [user,setUser] = useState([]);
    const geolib = require('geolib');
    const [initialDis,setInitialDis] = useState(0);


    useEffect(() => {
        const getUser = async ()=> {
            const userDoc = doc(firestore,"Users",  auth.currentUser.uid);
           
            try{const docSnap = await getDoc(userDoc);
            if (docSnap.exists()){
                setUser(docSnap.data());
                const Origin = {
                    latitude:docSnap.data().Location.latitude,
                    longitude:docSnap.data().Location.longitude,}
                const Dest = {
                    latitude:event.Location.latitude,
                    longitude:event.Location.longitude,}
                const dist = geolib.getDistance(Origin,Dest);
                setInitialDis(dist);
            }
            else{
                console.log("can't find the user in firestore");
            }
            if (docSnap.data().CollectedEvents.includes(event.key)){
                setCollected(true);
            }else{
                setCollected(false);
            }}
            catch(err){
                console.log(err);
            }
        }
        getUser();
    
    },[])


    const collectHandler = ()=>{
        updateCollectedEvents(auth.currentUser.uid,event.key);
        if (isCollected){
            setCollected(false);
        }else{
            setCollected(true);
        }
    }


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
        <View style={MyStyle.itemTextContainer}>
            <View style={MyStyle.rowContainer}> 
                <View style={MyStyle.snapTitle}> 
                    <Text style={MyStyle.snapTextTitle}> {event.Theme}  </Text>
                </View>
                <View style={MyStyle.shareAndCollect}> 
                    <Pressable
                        onPress={()=>{
                            collectHandler();
                        }}
                        >
                        {isCollected?
                        <View>
                            <AntDesign name="star" size={20} color="orange" />
                        </View>
                        :
                        <View>
                            <AntDesign name="staro" size={20} color="orange" />
                        </View>
                        }   
                    </Pressable>

                </View>
            </View>
            <View style={MyStyle.snapImgContainer}>
                {event.postImg? <Image
                resizeMode="contain"
                style={MyStyle.snapImg}
                    source={{
                        uri: event.postImg,
                    }}/>:<Image
                    resizeMode="contain"
                    style={MyStyle.snapImg}
                        source={{
                            uri: "https://images.fnlondon.com/im-413154/?width=959&height=639",
                        }}/>
                }
               
            </View>
            <View style={[MyStyle.eventInfoSnap,{marginBottom:-10}]}>
                <View style={MyStyle.eventInfoSnapContent}> 
                    <Text style={{fontSize:12}}>{event.Description} </Text>
                </View>
                <View style={MyStyle.rowSnapContainer}> 
                    <View style={MyStyle.eventInfoSnapDate}> 
                        <Text> <MaterialCommunityIcons name="party-popper" size={18} color="black" /> {event.GoingNum}/{event.Quota} Registered </Text>
                    </View>
                    <View style={MyStyle.eventInfoSnapDistance}> 
                        <Text> <MaterialCommunityIcons name="signal-distance-variant" size={20} color="black" /> 

                                 {initialDis==0?
                                    <ActivityIndicator color="#A3C7D6" />:
                                    <LoadingComp initialDis={initialDis}/>
                                }
                                 
                        </Text>
                    </View>
                </View>
                <View style={[MyStyle.rowSnapContainer,{flex:1.5}]}> 
                    <View style={MyStyle.eventInfoSnapNoPeople}> 
                        <Text> <Fontisto name="date" size={18} color="black" /> {event.Date.dateString} </Text>
                    </View>
                    {(event.Location.address)?                      
                        <View style={MyStyle.eventInfoSnapDistance}> 
                            <Text> <Entypo name="location-pin" size={18} color="black" /> {event.Location.address} </Text>
                        </View>
                            :
                        <View style={MyStyle.eventInfoSnapDistance}> 
                            <Text> <Entypo name="location-pin" size={18} color="black" /> {event.Location} </Text>
                        </View> 
                    }
                    
                </View>
                
                {event.Label && event.Label!=[]? <View style={[MyStyle.rowSnapContainer,{flex:1.5,alignItems:"center",justifyContent:"center"}]}> 
                        <Octicons name="hash" size={18} color="black" />
                        <FlatList 
                        horizontal={true} style={{margin:8}} 
                        data={event.Label}
                        renderItem={({ item }) => {
                            return (
                              <ShowLabels  event = {item} />
                            );
                          }}
                        />
                </View> :<></>
                
                }

            </View> 
        </View>
    </Pressable>
       
  )
}
