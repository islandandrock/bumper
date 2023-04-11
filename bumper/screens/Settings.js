import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button, Image } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getFriendRequests } from '../util/requests';
import { getData, removeData, storeData } from '../util/storage'

import * as Location from 'expo-location';


import { ScrollView } from 'react-native-gesture-handler';
import { LicensePlate } from '../util/components';

import { UserList } from '../util/components';

export default function SettingsScreen ( {navigation} ) {
  useEffect (() => {
    
  }, [])
  return (
    <View>
      <View style={{height:100, justifyContent:"center"}}>
        <Text style={{textAlign:"center", fontSize:15, fontWeight:"bold"}}>More settings coming soon!</Text>
      </View>
      <TouchableOpacity style={{backgroundColor:"#EDCAD8", height:50, borderRadius:10, justifyContent:"center"}} onPress={async () => {await removeData("name"); await removeData("user_id"); await storeData("auto_login", "false"); navigation.navigate("Sign In")}}>
        <Text style={{textAlign:"center", fontWeight:"bold", fontSize:20}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
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