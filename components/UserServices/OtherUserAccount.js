import { View, Text,StyleSheet,Pressable,Image,FlatList,RefreshControl } from 'react-native';
import React,{useState,useEffect,useLayoutEffect} from 'react';
import Colors from '../../Helper/Colors';
import { collection, onSnapshot,doc,getDoc} from "firebase/firestore";
import { firestore } from '../../firebase/firebase-setup';
import EventCube from '../EventServices/EventCube';




export default function OtherUserAccount({navigation,route}) {

    const [user,setUser] = useState([]);
    const [event,setEvent] = useState([]);
    const [testPost,setTestPost] = useState([]);
    const [testJoin,setTestJoin] = useState([]);
    const [postNum,setPostNum] = useState(0);
    const [joinNum,setJoinNum] = useState(0);
    const [postEvent, setPostEvent] = useState(null);
    const [signedEvent, setSignedEvent] = useState(null);
    const [showPost, setShowPost]= useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [didMount, setDidMount] = useState(false); 


    const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(400).then(() => setRefreshing(false));
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
              var data1 = [{ ...data, key: snapDoc.id }];          
              return data1; 
            })
          );});  
          let arr = event;
          const updatePost = ()=>{
            let list1 = route.params.Object.HostEvents;
            if (list1 && arr){
              setTestPost(arr.filter(item=>list1.includes(item[0].key))); 
            }
          } 
          const updateJoin = ()=>{
            let list1 = route.params.Object.JoinEvents;
            if (list1 && arr){
              setTestJoin(arr.filter(item=>list1.includes(item[0].key)));  
            }
          } 
      
      return () => { 
            if(user){showEvents()}
            if(event){updatePost();
              updateJoin();}
          };
      }, [user]);

      useEffect(() => {
        const getUser = async () => {
          const userDoc = doc(firestore, "Users", route.params.Object.uid);
          try{
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
              setUser(docSnap.data());
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
        let list1 = route.params.Object.HostEvents;
        if (list1 && arr){
          setTestPost(arr.filter(item=>list1.includes(item[0].key))); 
        }
      } 
      const updateJoin = ()=>{
        let list1 = route.params.Object.JoinEvents;
        if (list1 && arr){
          setTestJoin(arr.filter(item=>list1.includes(item[0].key)));  
        }
      } 
  
      updatePost();
      updateJoin();
      
    },[route]);

    useEffect(() => {
      setDidMount(true);
      return () => setDidMount(false);
   }, [])
   




  useEffect(() => {
    const updateUser = () => {
      if (route.params) {
        setUser(route.params.Object);
        setPostNum(route.params.Object.HostEvents.length);
        setJoinNum(route.params.Object.JoinEvents.length);
        setSignedEvent(route.params.Object.JoinEvents);
        setPostEvent(route.params.Object.HostEvents);
       
      }
    };
    updateUser();
  }, [route,didMount]); 


    const postEvents = ()=>{
      setShowPost(true);
      console.log("postEvent???? :",postEvent)
      onRefresh();

    }
    const eventHistory =()=>{
        setShowPost(false);
        onRefresh();
    }
    if(!didMount) {
      return null;
    }
return (
    <View style={styles.screen}>
    <View style = {styles.topContainer}>
        <View style={{alignItems:"center"}}>
          <Image
          style ={styles.doggyImage}
          source={{ uri: route.params.Object.Avatar }}
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

    </View>

    <View style={styles.bottomContainer}>

      <View style = {styles.pressables}>
        <Pressable onPress={()=>{
          postEvents();}} style={({pressed})=>[
          {backgroundColor: pressed ? 'lightgray' : Colors.detailBkg},     
          styles.wrapperCustom
        ]}>
          <Text style={styles.text}>Post Events</Text>
          <Text style={styles.num}> {postNum}</Text>
        </Pressable>
        
        <Pressable onPress={()=>{eventHistory();}} style={({pressed})=>[
          {backgroundColor: pressed ? 'lightgray' : Colors.detailBkg},     
          styles.wrapperCustom
        ]}>
          <Text style={styles.text}> Join Events </Text>
          <Text style={styles.num}> {joinNum}</Text>
        </Pressable>
      </View>
      <View style={[styles.cardContainer,{alignItems:"center"}]}>
      {showPost && postEvent!=null ?  <FlatList
          data={testPost} numColumns={2} style={{margin:0}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            return ( <EventCube event={item}/>);
          }}/> :<></>}


      {!showPost && signedEvent!=null  ? <FlatList
          data={testJoin} numColumns={2} style={{margin:10}}
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
marginVertical:0,
marginHorizontal:10,
},
bottomContainer: {
  flex: 7, 
  backgroundColor: "#fff",
  alignItems: "center",
},
wrapperCustom: {
borderRadius: 8,
padding: 5,
marginHorizontal:15,
marginTop:10,

},
pressables:{
  margin:5,
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
marginBottom:10,
borderRadius:60,
},
showAccountInfo:{
flexDirection: 'row',
fontSize:15,
marginHorizontal:5

},
num:{
  alignSelf:'center'
},
button:{
//position: 'absolute',
// right:10,
marginLeft:5,
bottom:4,  
},
editProfile:{
marginTop:10,
marginBottom:0,
fontSize:20,
padding:4,
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
borderRadius:25,
margin:2,

}

});
