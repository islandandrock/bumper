import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getFriends, friendSearch, addLocation} from '../util/requests';
import { getData } from '../util/storage'

import * as Location from 'expo-location';


import { ScrollView } from 'react-native-gesture-handler';
import { LicensePlate } from '../util/components';


const SearchBar = (props) => {
  return (
      <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
  )

}


export default function FriendScreen ( {navigation} ) {
  const [SearchText, SetSearchText] = useState('');
  const [SearchFriends, SetSearchFriends] = useState([])
  const [ListMode, SetListMode] = useState(true)
  const [user_id, setUser_id] = useState("")
  const [friends, setFriends] = useState([])
  const [refresh, forceRefresh] = useState(false)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const asyncFunc = async () => {
      let user_id_temp = await getData("user_id");
      setUser_id(user_id_temp);
      let temp = await getFriends(user_id_temp)
      console.log("1", temp)
      setFriends(temp)
      temp = await friendSearch(SearchText)
      console.log(temp)
      SetSearchFriends(temp)

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      addLocation([location.coords.latitude, location.coords.longitude])
    }
    asyncFunc();
  }, [refresh])
  

  return (
    <View style={{width:'100%', height:'100%'}}>
      <View style={{position:'absolute', zIndex:1, bottom:10, right:10}}>
      </View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>       
        <TouchableOpacity style={{width:'30%', backgroundColor:"pink", borderRadius:10, justifyContent:'center', marginLeft:5}} onPress={()=>forceRefresh(!refresh)}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
        <TouchableOpacity style={styles.toggle} onPress={() => SetListMode(!ListMode)}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Toggle Mode</Text>
        </TouchableOpacity>
      </View>
      {ListMode ? 
      (
        <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1}}>
          <ScrollView style={{width: "100%"}}>
            {SearchFriends.map((user) =>
              <TouchableOpacity style={[styles.userList]} key={user.id} onPress={() => navigation.navigate("Profile", {id:user.id})}>
                <LicensePlate width={80} plate={user.plate} name={user.linked ? "oregon" : "unlinked"} style={{marginRight:20}}/>
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
      ):(
        <View style={{justifyContent: 'center', flexDirection: 'column'}}>
          {location?           
          <View style={{position:'absolute', zIndex:1, top:10, right:10}}>
            <TouchableOpacity style={{width:80, height:40, backgroundColor:'pink', borderRadius:10, justifyContent:'center', alignItems:'center'}} onPress={() => {forceRefresh(!refresh)}}>
              <Text style={{fontWeight:'bold', fontSize:18}}>Reload</Text>
            </TouchableOpacity>
          </View>: null}
          {location?    
        <MapView  initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                  }} style={styles.map}>
                {friends.map((friend) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={friends.indexOf(friend)} coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}} pinColor={'pink'}>
  <Text style={styles.friendPin}>{friend.plate}</Text></Marker>)}
                <Marker coordinate={{latitude : location.coords.latitude , longitude : location.coords.longitude}}><Text style={styles.friendPin}>You</Text></Marker>
          </MapView> : null}
        </View>
      )}
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

  friendPin: {
    backgroundColor: 'pink',
    borderRadius: 100,
    padding: 5,
    borderRadius:10
  },

  friendList: {
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

  map: {
    width: '100%',
    height: '100%',
    borderRadius:10,
    marginRight:10,
    justifyContent:'center'
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

  user: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})