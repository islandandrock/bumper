import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking, Button} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getFriend } from '../util/requests';
import { getData } from '../util/storage'


const SearchBar = (props) => {
  return (
    <View>
      <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
    </View>

  )

}



export default function FriendScreen ( {navigation} ) {
  const [SearchText, SetSearchText] = useState('');
  const [ListMode, SetListMode] = useState(true)
  const [user_id, setUser_id] = useState("")
  const [friends, setFriends] = useState([])
  const [refresh, forceRefresh] = useState(false)

  useEffect(() => {
    const asyncFunc = async () => {
      let user_id_temp = await getData("user_id");
      setUser_id(user_id_temp);
      let temp = await getFriend(user_id_temp)
      setFriends(temp)
    }
    asyncFunc();
  }, [refresh])

  const Pins = friends.map((friend) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={friends.indexOf(friend)} coordinate={{latitude: 37.78825, longitude: -122.4324}} pinColor={'pink'}>
  <Text style={{backgroundColor: 'pink', borderRadius: 100, padding: 5}}>{friend.username}</Text></Marker>)

  return (
    <View>
      <View style={styles.container}>
        <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
        <TouchableOpacity style={styles.toggle} onPress={() => SetListMode(!ListMode)}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Toggle Mode</Text>
        </TouchableOpacity>
      </View>
      {ListMode ? 
      (
        
        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Button style={{height:50, width:50, backgroundColor:"red"}} title="RELOAD" onPress={() => forceRefresh(!refresh)}></Button>
          <FlatList data={friends} 
          renderItem={({item}) => <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}><Text style={styles.friend}>{item.username}</Text></TouchableOpacity>}/>
        </View>
      ):(
        <View style={{justifyContent: 'center', flexDirection: 'column'}}>
          <MapView   initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                  }} style={styles.map}>
                {Pins}
          </MapView>
        </View>
      )}
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
  }
})