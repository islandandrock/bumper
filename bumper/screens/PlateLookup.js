import { useLinkProps } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import { useState, useEffect } from 'react';


import {signUp} from "../util/requests"

function PlateButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={async ()=>await signUp("theo", "t@a.com", "password")}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const SearchBar = (props) => {
  return (
      <View>
          <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
      </View>

  )

}

export default function PlateLookupScreen () {
  const [SearchText, SetSearchText] = useState('');
  return (
    <View style={{width:"100%"}}>
      <View style={{flexDirection:"row"}}>
        <PlateButton text={"ENTER USERNAME"}/>
        <PlateButton text={"ENTER PLATE"}/>
      </View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },  

  marker: {
  backgroundColor: 'pink',
  },

  toggle: {
  backgroundColor:'pink',
  padding: 10,
  borderRadius: 10
  },

  input: {
  borderRadius:10,
  padding:10,
  backgroundColor: '#fff',
  borderWidth:1,
  borderColor: 'pink'
  }
})