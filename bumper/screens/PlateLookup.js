import { useLinkProps } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList} from 'react-native';
import { useState, useEffect } from 'react';


import {signUp, search} from "../util/requests"

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
  const [SearchText, SetSearchText] = useState('u1');
  const [SearchUsers, SetSearchUsers] = useState([])

  useEffect(() => {
    const asyncFunc = async () => {
      SetSearchUsers(await search(SearchText))
    }
    asyncFunc();
}, [])

  return (
    <View style={{width:"100%"}}>
      <View style={{flexDirection:"row"}}>
        <PlateButton text={"ENTER USERNAME"}/>
        <PlateButton text={"ENTER PLATE"}/>
      </View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
      </View>
      <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
        <FlatList data={SearchUsers} renderItem={({item}) => <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}><Text style={styles.user}>{item.username}</Text></TouchableOpacity>}/>
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
  },
  
  user: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    padding:10,
    paddingLeft:20,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
}
})