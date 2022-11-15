import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getFriend, friendSearch} from '../util/requests';
import { getData } from '../util/storage'

import * as Location from 'expo-location';


import { ScrollView } from 'react-native-gesture-handler';


const SearchBar = (props) => {
  return (
      <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
  )

}

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
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
      let temp = await getFriend(user_id_temp)
      setFriends(temp)
      SetSearchFriends(await friendSearch(SearchText))

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    asyncFunc();
  }, [refresh])
  

  //const Pins = friends.map((friend) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={friends.indexOf(friend)} coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}} pinColor={'pink'}>
  //<Text style={{backgroundColor: 'pink', borderRadius: 100, padding: 5}}>{friend.username}</Text></Marker>)

  return (
    <View style={{width:'100%', height:'100%'}}>
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
          <Text>{location}</Text>
          <ScrollView style={{width: "100%"}}>
            {SearchFriends.map((user) => <TouchableOpacity style={styles.friendList} key={user.id} onPress={() => navigation.navigate("Profile", {id:user.id})}><Text style={styles.friend}>{user.username}</Text></TouchableOpacity>)}
          </ScrollView>
        </View>
      ):(
        <View style={{justifyContent: 'center', flexDirection: 'column'}}>
          <MapView   initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                  }} style={styles.map}>
                {location? friends.map((friend) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={friends.indexOf(friend)} coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}} pinColor={'pink'}>
  <Text style={{backgroundColor: 'pink', borderRadius: 100, padding: 5}}>{friend.username}</Text></Marker>): null}
          </MapView>
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

  friend: {
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