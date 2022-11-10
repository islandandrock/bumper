import { useLinkProps } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList} from 'react-native';
import { useState, useEffect } from 'react';


import {signUp, userSearch} from "../util/requests"

function PlateButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={async ()=>await signUp("theo", "t@a.com", "password")}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const SearchBar = (props) => {
  return (
    <TextInput style={[styles.input]} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>


  )

}

export default function PlateLookupScreen ({ navigation }) {
  const [SearchText, SetSearchText] = useState('');
  const [SearchUsers, SetSearchUsers] = useState([])

  useEffect(() => {
    const asyncFunc = async () => {
      SetSearchUsers(await userSearch(SearchText))
    }
    asyncFunc();
}, [])

  return (
    <View style={{width:"100%", height:"100%"}}>
      <View style={{flexDirection:"row"}}>
        <PlateButton text={"ENTER USERNAME"}/>
        <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={async ()=>SetSearchUsers(await search(SearchText))}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>ENTER PLATE</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>       
        <TouchableOpacity style={{width:100, height:50, backgroundColor:"pink", borderRadius:10, alignItems:'center', justifyContent:'center', margin:10}} onPress={async ()=>SetSearchUsers(await userSearch(SearchText))}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
        <FlatList data={SearchUsers} renderItem={({item}) => <TouchableOpacity onPress={() => navigation.navigate("Profile", {id:item.id})}><Text style={styles.user}>{item.username}</Text></TouchableOpacity>}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection:'row',
    width:300,
    height:60
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
  borderColor: 'pink',
  alignSelf:'flex-start',
  width:250,
  marginTop:10
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