import React,{useState,useEffect} from 'react';
import {
  View,
  Image,
  Pressable,

} from "react-native";
import { doc,getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase-setup";
import MyStyle from '../../Helper/MyStyle';
import { useNavigation } from '@react-navigation/native';




export default function Attendee({AttendeeId}) {
  
    
    const navigation = useNavigation();
    const [host,setHost] = useState([]);
    const AttendeeId1 = AttendeeId;




    useEffect(() => {
        const getUser = async ()=> {
            const userDoc = doc(firestore,"Users", AttendeeId1);
            try{const docSnap = await getDoc(userDoc);
            if (docSnap.exists()){
                setHost(docSnap.data());
            }
            else{
                console.log("can't find the host user user in firestore");
            }}
            catch(err){
              console.log(err);
            }
        }
        getUser();

    },[])

    
    return (
    <> 
      

        <View style={MyStyle.container}>
          <View style={MyStyle.container}>

          <Pressable 
            style={{flex:1,width:50,height:50,margin:2}}
            onPress={()=>{
              console.log("haha",host);
              navigation.navigate("OtherUser",{Object:host});
            }}> 
                    
              <View style={MyStyle.AvatarContainer}> 
                <Image
                  resizeMode="stretch"
                  style={MyStyle.avatarImg}
                  source={{
                  uri: host.Avatar       
                }}/>
              </View>

          </Pressable>
        </View> 
      </View> 

    </>
  )
}

