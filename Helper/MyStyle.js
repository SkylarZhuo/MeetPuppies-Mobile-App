
import Color from "./Colors";
const MyStyle = {
      container: {
        flex: 1,
        //backgroundColor: Color.backgroundAll,
        alignItems: "center",
        justifyContent: "center",
      },
      topContainer:{
        flex:1,
        width:"100%",
      },
      bottomContainer: {
        flex: 10,
        width:"100%",
      },
      itemTextContainer:{
        flex:1,
        margin:15,
        padding:5,
        height:300,
        borderBottomWidth:0.8,
        borderRadius:20,
        //backgroundColor:Color.cardBkg,
       //borderColor:Color.titleBorder,
        
      },
      rowSnapContainer:{
        flex:0.7,
        flexDirection:"row"
      },
      searchBar:{
        flex: 1,
        width:"100%"
      },
      snapTitle:{
        flex:1,
        marginLeft:45,
        alignItems:"center",
        justifyContent:"center",
        
      },
      snapTextTitle:{
        fontSize:18,
        fontWeight:"bold"
        
      },
      snapImgContainer:{
        flex:4,
        alignItems:"center",
      },
      snapImg:{
        flex:1,
        width:"90%",
        height:150,
        borderRadius:10,
        overflow: 'hidden' 
      },
      eventInfoSnap:{
        flex:3.5,
        margin:5,
        padding:5,
        borderRadius:10,
      },
      eventInfoSnapContent:{
        fontSize:15,
        margin:1,
        flex:0.55,
        alignItems:"center",
        borderRadius:10,
       
      },
      eventInfoSnapDate:{
        flex:0.8,
        alignItems:"flex-start"
      },
      eventInfoSnapNoPeople:{
        flex:0.8,
        alignItems:"flex-start"
      },
      eventInfoSnapDistance:{
        flex:0.8,
        alignItems:"flex-end",
        
      },
      pressedItem: {
        backgroundColor: "#AEBDCA",
        borderRadius:25,
        marginHorizontal:10,
        opacity: 0.5,
      },
      eventDetailContainer:{

        flex:1,
        margin:15
        //backgroundColor:Color.detailBkg,
      },
      rowContainer:{
        flexDirection:"row",
        flex:1
      },
      flex1:{
        flex:0.75,
        alignItems:"flex-start",
        justifyContent:"center",
        
      },
      flex2:{
        flex:2,
        alignItems:"center",
        justifyContent:"center",
      },
      flex3:{
        flex:3,
        alignItems:"center",
        justifyContent:"center",
       
      },
      AttendArea:{
        flex:1,
        margin:17,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:Color.cardBkg,
        borderRadius:20,
        flexDirection:'row',
      },
      shareAndCollect:{
        flex:0.2,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
      },
      fontSize18:{
        flex:0.5,
        fontSize:18,

      },
      buttonFont:{
        fontSize:20,
        fontWeight:"bold",
        color:"#285430"
      },
      eventPuppyHostImg:{
        flex:1,
        overflow: 'hidden',

      },
      avatarImg:{
        flex:1,
        width:"100%",
        height:15,
        overflow: 'hidden',
        borderRadius:25,
       

      },
      attendeeAvatar:{
        flex:1,
        height:10,
        alignItems:"center",
        overflow: 'hidden',
        borderRadius:"25%",
        borderWidth:1,
        borderColor:Color.avatarBorder
      },
      AvatarContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        margin:2,
        padding:2,
        height:40,
        width:"90%",
        borderRadius:25,
        backgroundColor:Color.avatar,
        overflow:"hidden"
      },
      buttoncontainer: {
        padding: 0,
        marginVertical: 5,
        borderRadius: 10,
        //backgroundColor: "#DEBACE",
        backgroundColor:Color.detailBkg,
        flexDirection: "row",
        height: 40,
        width: 150,
        justifyContent: "center",
        color: "white",
      },
      buttconContainer2: {
        borderRadius: 10,
        borderColor: "black",
        padding: 3,
        borderWidth: 2,
        marginTop: 5,
        backgroundColor: "#DEBACE",
      },
      detailContainer: {
        padding: 8,
        marginHorizontal: 35,
        borderBottomWidth: 2,
        borderColor: "gray",
      },
      cubeContainer:{
        flex:1,
        margin:3,
        marginHorizontal:8,
        padding:5,
        height:200,
        width:170,
        borderWidth:0.8,
        borderRadius:20,
        borderColor:Color.titleBorder

      }

}
    
    
export default MyStyle;

