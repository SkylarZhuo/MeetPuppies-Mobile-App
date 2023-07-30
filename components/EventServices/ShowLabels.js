import { View, Text,StyleSheet } from 'react-native'
import Colors from '../../Helper/Colors'
import React from 'react'

export default function ShowLabels({event}) {
    
  return (
    <View style={styles.editProfile}> 
        <Text style={{color:"gray"}}>{event}</Text>
    </View>
  )
}

const styles = StyleSheet.create({

      editProfile:{
        marginTop:1,
        marginHorizontal:4,
        marginBottom:0,
        fontSize:14,
        padding:4,
        backgroundColor:Colors.detailBkg,
        borderRadius:20,
      }
})