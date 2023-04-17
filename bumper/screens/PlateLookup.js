import { useLinkProps } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Linking, Alert, ActivityIndicator} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect, useRef } from 'react';


import {signUp, userSearch, uploadPic} from "../util/requests"
import { LicensePlate, UserList } from "../util/components"


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
  const [Loading, SetLoading] = useState(false)
  const [type, setType] = useState(CameraType.back);
  const [permission, setPermission] = useState(null)


  useEffect(() => {
    const asyncFunc = async () => {
      SetSearchUsers(await userSearch(SearchText))
      const permissionStatus = await Camera.requestCameraPermissionsAsync();
      setPermission(permissionStatus.status === 'granted');
    }
    asyncFunc();
  }, [])

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync()
    let pic = result.uri;
    if (!pic) {
      return
    }
    let picname = pic.split('/').pop();

    let match = /\.(\w+)$/.exec(picname);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData()
    formData.append('photo', {uri: pic, name:picname, type })
    SetLoading(true)
    plate_data = await uploadPic(formData)
    console.log(plate_data)
    SetLoading(false)
    if (plate_data.results.length != 0 && plate_data.results[0].score > .75) {
      plate_data = plate_data.results[0].plate
      SetSearchText(plate_data)
    } else {
      Alert.alert('No plate', 'We\'re sorry, the picture you took does not have a recognizable plate. Please try again.')
    }
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
        {Loading  ? 
        (
          <View style={{alignSelf: 'center', height:"100%", width:"100%", justifyContent:"center"}}>        
            <ActivityIndicator style={{transform:[{scale:2}]}} size='large' color='#F4CBCB'/>
          </View>

        ) : (
          <UserList users={SearchUsers} navigation={navigation}/>
        )}
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