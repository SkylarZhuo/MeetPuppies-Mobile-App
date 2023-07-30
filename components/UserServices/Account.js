import { View, Text,StyleSheet,Pressable,Image,FlatList,RefreshControl } from 'react-native'
import React, { useState, useEffect }from 'react'
import { auth } from '../../firebase/firebase-setup'
import { useRoute } from "@react-navigation/native";
import Colors from '../../Helper/Colors'
import { getDoc, doc,collection, onSnapshot} from "firebase/firestore";
import { firestore } from '../../firebase/firebase-setup'
import EventCube from '../EventServices/EventCube';


export default function Account({navigation}) {

  const [event, setEvent] = useState([]);
  const [showPost, setShowPost]= useState(true);
  const [postEvent, setPostEvent] = useState(null);
  const [signedEvent, setSignedEvent] = useState(null);
  const [user, setUser] = useState([]);
  const [imgUri, setImgUri] = useState();
  const [postNum,setPostNum] = useState(0);
  const [joinNum,setJoinNum] = useState(0);
  const [collectNum,setCollectNum] = useState(0);
  const [collectedEvent,setCollectedEvent] = useState(null);
  const [showColl,setShowColl] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [testPost,setTestPost] = useState([]);
  const [testJoin,setTestJoin] = useState([]);
  const [testCollect,setTestCollect] = useState([]);
  const [didMount, setDidMount] = useState(false); 

  const route = useRoute();
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(400).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
 }, [])

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
            var data1 = [{ ...data, key: snapDoc.id }];          
            return data1; 
          })
        );});
    
    return () => { 
      if(user){showEvents();}
    };
  }, [user]);


  useEffect(() => {
    const updateUser = () => {
      if (route.params) {
        setUser(route.params.itemObject);
        setImgUri(route.params.itemObject.Avatar);
        setSignedEvent(route.params.itemObject.JoinEvents);
        setPostEvent(route.params.itemObject.HostEvents);
        setPostNum(route.params.itemObject.HostEvents.length);
        setJoinNum(route.params.itemObject.JoinEvents.length);
        setCollectNum(route.params.itemObject.CollectedEvents.length);
      }
    };
    updateUser();
  }, [route,didMount]); 



  useEffect(() => {
    const getUser = async () => {
      const userDoc = doc(firestore, "Users", auth.currentUser.uid);
      try{
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setImgUri(docSnap.data().Avatar);
          setSignedEvent(docSnap.data().JoinEvents);
          setPostEvent(docSnap.data().HostEvents);
          setCollectedEvent(docSnap.data().CollectedEvents);
          setPostNum(docSnap.data().HostEvents.length);
          setJoinNum(docSnap.data().JoinEvents.length);
          setCollectNum(docSnap.data().CollectedEvents.length);
        } else {
          console.log("can't find the user in firestore");
        }}
      catch(err){
        console.log("get user in account page",err);
      }
    };
    getUser();
  }, [user]); 
    
  useEffect(()=>{
    let arr = event;
    const updatePost = ()=>{
      let list1 = postEvent;
      if (list1 && arr){setTestPost(arr.filter(item=>list1.includes(item[0].key)));  }
       //console.log("---",arr.filter(item=>list1.includes("7FNEfvyKoyFeLRQsXqZL")))
    } 
    const updateCollect = ()=>{
      let list1 = collectedEvent;
      if (list1 && arr){setTestCollect(arr.filter(item=>list1.includes(item[0].key)));  }
    } 
    const updateJoin = ()=>{
      let list1 = signedEvent;
      if (list1 && arr){setTestJoin(arr.filter(item=>list1.includes(item[0].key)));  }
    } 

    updatePost();
    updateCollect();
    updateJoin();
    
  },[user,didMount])


  const postEvents = ()=>{
      setShowPost(true);
      setShowColl(false);
      onRefresh();

  }
  const eventHistory =()=>{
      setShowPost(false);
      setShowColl(false);
      onRefresh();
  }

  const collectEventShow = ()=>{
    setShowColl(true);
    setShowPost(null);
    onRefresh();
  }

  const editProfile = ()=>{
    navigation.navigate("Edit My Profile");
  }




  return (
    <View style={styles.screen}>
        <View style = {styles.topContainer}>
            <View style={{alignItems:"center"}}>
              <Image
              style ={styles.doggyImage}
              source={{ uri: imgUri }}
              />
            </View>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
    
              <View style = {[styles.showAccountInfo,{flexWrap:"wrap"}]}>
                <Text style={styles.bold}>Username: </Text>
                <Text>{user.userName}</Text>
              </View>
              <View style = {[styles.showAccountInfo,{flexWrap:"wrap"}]}>
                <Text style={styles.bold}>Email: </Text>
                <Text>{user.userEmail}</Text>
              </View> 
            </View>
            <View style = {styles.button}>
                <Pressable style={styles.editProfile} onPress = {editProfile}>
                    <Text>         Edit Profile        </Text>
                </Pressable>
            </View>
        </View>

        <View style={styles.bottomContainer}>

          <View style = {styles.pressables}>
            <Pressable onPress={()=>{
              postEvents();}} style={({pressed})=>[
              {backgroundColor: pressed ? 'lightgray' : Colors.detailBkg},     
              styles.snapCard
            ]}>
              <Text style={styles.text}>Post Events</Text>
              <Text> {postNum}</Text>
            </Pressable>
            
            <Pressable onPress={()=>{eventHistory();}} style={({pressed})=>[
              {backgroundColor: pressed ? 'lightgray' : Colors.detailBkg},     
              styles.snapCard
            ]}>
              <Text style={styles.text}> Join Events </Text>
              <Text> {joinNum}</Text>
            </Pressable>

            <Pressable onPress={()=>{collectEventShow();}} style={({pressed})=>[
              {backgroundColor: pressed ? 'lightgray' : Colors.detailBkg},     
              styles.snapCard
            ]}>
              <Text style={styles.text}>Collect Events</Text>
              <Text> {collectNum}</Text>
            </Pressable>

          </View>
          <View style={[styles.cardContainer,{alignItems:"center"}]}>
          {showPost && postEvent!=null && !showColl?  <FlatList
              data={testPost} numColumns={2} style={{margin:"2%"}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => {
                return ( <EventCube event={item}/>);
              }}/> :<></>}
          {!showPost && signedEvent!=null && !showColl? <FlatList
              data={testJoin} numColumns={2} style={{margin:10}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />}
              renderItem={({ item }) => {
                return (<EventCube  event = {item} />);
              }}/>:<></>}

          {showPost == undefined  && collectedEvent!=null ? <FlatList
              data={testCollect} numColumns={2} style={{margin:10}}
              refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />}
              renderItem={({ item }) => {
                return (<EventCube  event = {item} />);
              }}/>:<></>} 
        </View>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
  screen:{
    flex: 1,
    backgroundColor:"white",
  },
  topContainer:{
    flex:2,
    backgroundColor:"white",
    borderBottomColor:"gray",
    borderBottomWidth:0.7,
    marginBottom:2,
    marginVertical:0,
  },
  bottomContainer: {
    flex: 5, 
    backgroundColor: "#fff",
    alignItems: "center",

  },
  pressables:{
    flexDirection: 'row',
   
  },

  text:{
    fontSize:16,
  },
  bold:{
    fontWeight:'bold'
  },
  doggyImage:{
    height:100,
    width:100,
    margin:10,
    padding:4,
    borderRadius:60,
  },
  showAccountInfo:{
    flexDirection: 'row',
    fontSize:15,
    marginHorizontal:5,  
  },
  editProfile:{
    margin:5,
    marginTop:5, 
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    fontSize:20,
    padding:10,
    backgroundColor:Colors.detailBkg,
    borderRadius:20,

  },
  cardContainer:{
    margin:0,
    marginTop:0,
    width:"100%",
  },
  snapCard:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#B7CADB",
    borderRadius:8,
    margin:5,
    padding:5

  }

});