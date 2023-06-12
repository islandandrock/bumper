import React, { useState, useEffect, useReducer, useRef } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button, Image, ScrollView, RefreshControl, Alert } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { getFriends, friendSearch, addLocation, getFriendRequests, getUser } from '../util/requests';
import { getData } from '../util/storage'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import * as Location from 'expo-location';

import { UserList, DropdownSearch } from '../util/components';

const Tab = createMaterialTopTabNavigator();


const SearchBar = (props) => {
  return (
      <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
  )

}

const FriendList = React.memo(function FriendList(props) {
  useFocusEffect(() => {
    props.setListMode(true)
  })
  return (
    <UserList users={props.users} navigation={props.navigation} emptyText={"No friends :( Go add some!"}/>
  )
})

const Map = React.memo(function Map(props) {
  useFocusEffect(() => {
      props.setListMode(false)
  })
  return (
    <View style={{justifyContent: 'center', flexDirection: 'column'}}>
          {props.latitude && props.longitude?    
        <MapView  initialRegion={{
                  latitude: props.latitude,
                  longitude: props.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                    }} ref={props.mapView} style={styles.map}>
                {props.friends.map((friend) => <Marker onPress={() => props.navigation.push("Profile", {id:friend.id})} key={props.friends.indexOf(friend)} coordinate={{latitude: parseFloat(friend.location.split(" ")[0]), longitude: parseFloat(friend.location.split(" ")[1])}} pinColor={'pink'}>
  <Text style={[styles.friendPin, {backgroundColor:(friend.id == props.searchID ? '#ee5d97' : 'pink'), padding:(friend.id == props.searchID ? 10 : 5), zIndex:(friend.id == props.searchID ? 1000 : 0), elevation:(friend.id == props.searchID ? 50 : 0)}]}>{friend.plate}</Text></Marker>)}
                <Marker coordinate={{latitude : props.latitude, longitude : props.longitude}}><Text style={styles.friendPin}>You</Text></Marker>
          </MapView> : null}
        </View>
  )
})

const SwipeTabs = React.memo((props) => {
  let SearchFriends = props.searchFriends
  let myID = props.id
  let friends = props.friends
  let longitude = props.longitude
  let latitude = props.latitude
  let mapView = props.mapView
  let navigation = props.navigation
  let searchID = props.searchID
  let listMode = props.listMode
  let setListMode = props.setListMode
  return (
    <Tab.Navigator style={{width:"100%", flexGrow:1, height:10}} screenOptions={{gestureEnabled: false, "tabBarStyle": {"backgroundColor": "#fff0f6"}
   }}>
      <Tab.Screen name={`FriendList${myID}`} options={{gestureEnabled: false, title:"FriendList"}}>
        {(props) => <FriendList users={SearchFriends} navigation={navigation} listMode={listMode} setListMode={setListMode}/>}
      </Tab.Screen>
      <Tab.Screen name={`Map${myID}`} options={{gestureEnabled: false, title:"Map"}}>
        {(props) => <Map searchID={searchID} mapView={mapView} longitude={longitude} latitude={latitude} friends={friends} listMode={listMode} setListMode={setListMode} navigation={navigation}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
})

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
  const mapView = React.createRef();
  const [searchID, setSearchID] = useState();



  const focusMap = async (personID) => {
    let person = await getUser(personID)
    console.log(parseFloat(person.location.split(' ')[1]))
    mapView.current.animateToRegion({
      latitude: parseFloat(person.location.split(' ')[0]),
      longitude: parseFloat(person.location.split(' ')[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      },1000);
  }


  const [refreshing, setRefreshing] = React.useState(false);
  let x = 1;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    forceRefresh(x);
    x += 1;
  }, []);


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
      setLongitude(location.coords.longitude)
      setLatitude(location.coords.latitude)


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
    setRefreshing(false);
    return unsubscribe;
    
  }, [refresh])

  const friendList = SearchFriends.map((user) => ({label: user.name + "; " + user.plate, value: user.id}))

  return (
    <ScrollView contentContainerStyle={{width:"100%", height:"100%"}} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } nestedScrollEnabled = {true}>
    <View style={{width:'100%', height:'100%', backgroundColor:"#fff0f6"}}>
      <View style={{position:'absolute', zIndex:1, bottom:10, right:10}}>
      </View>
      <View style={styles.container}>
        {ListMode && latitude && longitude ? 
        (
          <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
        ):(
          <DropdownSearch placeholder="Friends" data={friendList} function={setSearchID} style={{
            borderRadius:10,
            padding:10,
            backgroundColor: '#fff',
            borderWidth:1,
            borderColor: '#ee5d97',
            width: '70%'
          }}/>
        )}
        <TouchableOpacity style={{width:'30%', backgroundColor:"#ee5d97", borderRadius:10, justifyContent:'center', marginLeft:5}} onPress={()=>{ListMode ? forceRefresh(!refresh) : focusMap(searchID)}}>
          <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>Search</Text>
        </TouchableOpacity>
      </View>

      <SwipeTabs listMode={ListMode} setListMode={SetListMode} searchFriends={SearchFriends} searchID={searchID} friends={friends} longitude={longitude} latitude={latitude} mapView={mapView} id={user_id} navigation={navigation}/>
    </View>
    </ScrollView>
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
    borderColor: '#ee5d97',
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