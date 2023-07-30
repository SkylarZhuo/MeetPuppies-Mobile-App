import { collection, addDoc, deleteDoc,doc,setDoc,getDoc,updateDoc,arrayRemove,arrayUnion,  } from "firebase/firestore";
import { firestore,auth } from "./firebase-setup";

export async function addEvent(data) {
    try {
        const docRef = await addDoc(collection(firestore, 'NewEvents'),data);
        console.log("Document written with ID: ", docRef.id);
    }
    catch (err) {
        console.log("add event failed",err) 
    }
}

export async function editEvent(key,data){
    const eventRef = doc(firestore, "Events", key);
    try{
        await updateDoc(eventRef,{
            "Theme":data.Theme,
            "Date" :data.Date,
            "Time":data.Time,
            "Description":data.Description,
            "Location":data.Location,
            "Quota":data.Quota
        });
    }catch (err) {
        console.log("firebase edit event",err);
    }
    
}





export async function addUserToDB(data) {
    try {
      const docRef = await addDoc(collection(firestore, "Users"), data);
    } catch (err) {
        console.log("Error occurs when creating user to database", err);
    }

  }

  
export async function addUserToDB2(data){
    try{
        await setDoc(doc(firestore,"Users",auth.currentUser.uid),data)
    }catch(error){
        console.log("Error occurs when creating user to database", error);
    }
}

export async function editProfile(key,user){
    
    try{
        const profileRef = doc(firestore, "Users", key);
        await updateDoc(profileRef,user)
        console.log("Update profile success!")
    }catch(error){

        console.log(error)
    }
}

export async function editAvartar(key,uri){
    console.log("edit avatar ", uri )
    try{
        const profileRef = doc(firestore, "Users", key);
        await updateDoc(profileRef,{
            Avatar: uri
        })
        console.log("Update avatar success!")
    }catch(error){

        console.log(error)
    }
}


export const  updateUserJoinEventList = async (userID,eventID) =>{
    const userDoc = doc(firestore,"Users", userID);
    const docSnap = await getDoc(userDoc);
    if (docSnap.data().JoinEvents.includes(eventID)){
        console.log("Alreday Register!,try to remove!")
        await updateDoc(userDoc, {
            JoinEvents: arrayRemove(eventID)});  
          console.log("remove Event Succeed!")
    }else{
      await updateDoc(userDoc, {
        JoinEvents: arrayUnion(eventID)});  
      console.log("Attend Event Succeed!")
    }
}


export const  updateEventAttendees = async (userID,eventID) =>{
    const userDoc = doc(firestore,"Events", eventID);
    const docSnap = await getDoc(userDoc);
    if (docSnap.data().Attendees.includes(userID)){
        console.log("Alreday Register!,try to remove!",docSnap.data().GoingNum-1);
        await updateDoc(userDoc, {
            Attendees: arrayRemove(userID),
            GoingNum: docSnap.data().GoingNum-1,
        });  
          console.log("remove Attendees Succeed!")
    }else{
        console.log("Not Register!,try to add!",docSnap.data().GoingNum+1);
      await updateDoc(userDoc, {
        Attendees: arrayUnion(userID),
        GoingNum: docSnap.data().GoingNum+1,
    });  
      console.log(" add Attendees Succeed!")
    }
}

export const  updateUserHostJoinEvents = async (userID,eventID) =>{
    const userDoc = doc(firestore,"Users", userID);
    const docSnap = await getDoc(userDoc);
    if (docSnap.data().JoinEvents.includes(eventID)){
        await updateDoc(userDoc, {
            JoinEvents: arrayRemove(eventID),
            HostEvents:arrayRemove(eventID),
        });  
          console.log("remove event Succeed!")
    }else{
      await updateDoc(userDoc, {
        JoinEvents: arrayUnion(eventID),
        HostEvents: arrayUnion(eventID),
    });  
      console.log(" add event Succeed!")
    }
}

export const updateCollectedEvents =async(userID,eventID)=>{
    const userDoc = doc(firestore,"Users", userID);
    const docSnap = await getDoc(userDoc);
    if (docSnap.data().CollectedEvents.includes(eventID)){
        await updateDoc(userDoc, {
            CollectedEvents: arrayRemove(eventID),
        });  
          console.log("remove event Succeed!")
    }else{
      await updateDoc(userDoc, {
        CollectedEvents: arrayUnion(eventID),
    });  
    console.log(" add event Succeed!")
    }
};


// done
export async function deleteEvent(key){
    try {
        await deleteDoc(doc(firestore, "Events", key));
      } catch (err) {
        console.log(err);
      }
}

export async function getUser() {
    const docRef = doc(firestore, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
  
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  }

export async function updateUserGeoLocation(key,lat,long) {
    const docRef = doc(firestore, "Users", key);
    await updateDoc(docRef, {
        "Location.latitude": lat,
        "Location.longitude": long,
      });
      
  }

export const deleteEventInUserHostJoinList = async(userID, eventID)=>{
    const userDoc = doc(firestore,"Users", userID);
    await updateDoc(userDoc, {
        JoinEvents: arrayRemove(eventID),  
        HostEvents: arrayRemove(eventID)
    })
}