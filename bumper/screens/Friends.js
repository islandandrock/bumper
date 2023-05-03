import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button, Image, Alert } from 'react-native';
import { useState, useEffect, useReducer } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getFriends, friendSearch, addLocation, getFriendRequests, getUser } from '../util/requests';
import { getData } from '../util/storage'

import * as Location from 'expo-location';

import { UserList, DropdownSearch } from '../util/components';


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
  const [errorMsg, setErrorMsg] = useState(null);
  const [notified, setNotified] = useState(true)
  const [PersonID, SetPersonID] = useState(null)
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [region, setRegion] = useState();




  useEffect(() => {
    const asyncFunc = async () => {
      let user_id_temp = await getData("user_id");
      setUser_id(user_id_temp);
      let temp = await getFriends(user_id_temp)
      setFriends(temp)
      temp = await friendSearch(SearchText)
      SetSearchFriends(temp)
      temp = await getFriendRequests()
      console.log(temp.length)
      setNotified(temp.length > 0)

      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Notifications", {user_id:user_id})}>
            <Image source={temp.length > 0 ? require('../assets/notification_active.png') : require('../assets/notification.png')} style={{height:38, width:38}}/>
          </TouchableOpacity>
        )})

      

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      addLocation(`${location.coords.latitude} ${location.coords.longitude}`)



      if (PersonID){
        let person = await getUser(PersonID)
        setLatitude(parseFloat(person.location.split(' ')[0]))
        setLongitude(parseFloat(person.location.split(' ')[1]))
        setRegion({
          latitude: parseFloat(person.location.split(' ')[0]),
          longitude: parseFloat(person.location.split(' ')[1]),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          })
        console.log('lat', latitude)
        console.log('long', longitude)
      } else {
        console.log("No Person selected")
        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)
      }
    }
    asyncFunc();

    const unsubscribe = navigation.addListener('focus', async () => {
      let temp = await getFriendRequests()
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Notifications", {user_id:user_id})}>
            <Image source={temp.length > 0 ? require('../assets/notification_active.png') : require('../assets/notification.png')} style={{height:38, width:38}}/>
          </TouchableOpacity>
        )})
    });

    return unsubscribe;
  }, [refresh])

  const FriendList = SearchFriends.map((user) => ({label: user.name, value: user.id}))

  return (
    <View style={{width:'100%', height:'100%', backgroundColor:"#FFF9F9"}}>
      <View style={{position:'absolute', zIndex:1, bottom:10, right:10}}>
      </View>
      <View style={styles.container}>
        {ListMode && latitude && longitude ? 
        (
          <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>       
        ):(
          <DropdownSearch placeholder="Friends" data={FriendList} function={SetPersonID} style={{
            borderRadius:10,
            padding:10,
            backgroundColor: '#fff',
            borderWidth:1,
            borderColor: 'pink',
            width: '70%'
          }}/>
        )}
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
        <UserList users={SearchFriends} navigation={navigation}/>
      ):(
        <View style={{justifyContent: 'center', flexDirection: 'column'}}>
          {latitude && longitude?           
          <View style={{position:'absolute', zIndex:1, top:10, right:10}}>
            <TouchableOpacity style={{width:80, height:40, backgroundColor:'pink', borderRadius:10, justifyContent:'center', alignItems:'center'}} onPress={() => {forceRefresh(!refresh)}}>
              <Text style={{fontWeight:'bold', fontSize:18}}>Reload</Text>
            </TouchableOpacity>
          </View>: null}
          {latitude && longitude?    
        <MapView  initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                  }} region={region} onRegionChange={setRegion} style={styles.map}>
                {friends.map((friend) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={friends.indexOf(friend)} coordinate={{latitude: parseFloat(friend.location.split(" ")[0]), longitude: parseFloat(friend.location.split(" ")[1])}} pinColor={'pink'}>
  <Text style={styles.friendPin}>{friend.plate}</Text></Marker>)}
                <Marker coordinate={{latitude : 60.538838, longitude : -150.6268205}}><Text style={styles.friendPin}>You</Text></Marker>
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
    width: '100%',
    padding:5,
    paddingLeft:10,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
    flexDirection:'row',
    alignItems:'center',
    marginVertical:3,
    borderRadius:10
  },

  user: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})