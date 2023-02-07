import { useLinkProps } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect, useRef } from 'react';


import {signUp, userSearch, uploadPic} from "../util/requests"
import { LicensePlate } from "../util/components"


function PlateButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center"}} onPress={props.onPress}>
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

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync()
    let pic = result.uri;
    let picname = pic.split('/').pop();

    let match = /\.(\w+)$/.exec(picname);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData()
    formData.append('photo', {uri: pic, name:"photo", type })
    await uploadPic(formData)
  }

  return (
    <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1, flexGrow:1}}>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>       
        <TouchableOpacity style={{width:'30%', backgroundColor:"pink", borderRadius:10, justifyContent:'center', marginLeft:5}} onPress={async ()=>SetSearchUsers(await userSearch(SearchText))}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row', justifyContent:'flex-end', height:60, padding:10}}>
        <TouchableOpacity style={{width:'40%', height:'100%', backgroundColor:"pink", borderRadius:10, justifyContent:'center', marginLeft:5}} onPress={async () => await takePicture() }>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Take Picture</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1, flexGrow:1}}>
        <ScrollView style={{width: "100%"}}>
          {SearchUsers.map((user) => 
            <TouchableOpacity style={[styles.userList]} key={user.id} onPress={() => navigation.navigate("Profile", {id:user.id})}>
              <LicensePlate width={80} plate={user.plate} state={user.linked ? "oregon" : "unlinked"} style={{marginRight:20}}/>
              <View style={{flexGrow:1, flexShrink:1}}>
                <Text style={[styles.user]} numberOfLines={1}>{user.name}</Text>
              </View>
              <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontWeight:"bold", fontSize:20}}>{user.numFriends}</Text>
                <Text style={{marginTop:-5, fontSize:10}}>Friends</Text>
              </View>
              <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontWeight:"bold", fontSize:20}}>{user.numConnections}</Text>
                <Text style={{marginTop:-5, fontSize:10}}>Connections</Text>
              </View>
            </TouchableOpacity>
          )}
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
    marginVertical:5,
    width: '100%',
    padding:5,
    paddingLeft:20,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
    borderRadius: 10,
    flexDirection:'row',
    alignItems:'center'
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
    fontSize: 20,
    fontWeight: 'bold',
  }
})