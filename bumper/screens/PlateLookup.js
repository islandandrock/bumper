import { useLinkProps } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {getFromWeb} from "../util/requests"

function PlateButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={()=>getFromWeb()}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default function PlateLookupScreen () {
  return (
    <View style={{width:"100%"}}>
      <View style={{flexDirection:"row"}}>
        <PlateButton text={"TAKE PICTURE"}/>
        <PlateButton text={"ENTER PLATE"}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

})