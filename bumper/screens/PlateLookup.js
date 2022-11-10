import { useLinkProps } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
        <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={async ()=>SetSearchUsers(await userSearch(SearchText))}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>ENTER PLATE</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>       
        <TouchableOpacity style={{width:'30%', backgroundColor:"pink", borderRadius:10, justifyContent:'center', marginLeft:5}} onPress={async ()=>SetSearchUsers(await userSearch(SearchText))}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1}}>
        <ScrollView style={{width: "100%"}}>
          {SearchUsers.map((user) => <TouchableOpacity style={styles.userList} key={user.id} onPress={() => navigation.navigate("Profile", {id:user.id})}><Text style={styles.user}>{user.username}</Text></TouchableOpacity>)}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    width:'100%',
    height:60,
    padding:10 
  },  

  userList: {
    margin: 5,
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
    width: '70%'

  },
  
  user: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    padding:10,
    paddingLeft:20,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
    borderRadius: 10
}
})