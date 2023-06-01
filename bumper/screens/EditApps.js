import {useState, useEffect} from 'react'
import { DropdownSearch } from '../util/components'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { signIn, updateUser, isCode, addConnection, removeConnection, editConnection } from '../util/requests';
import { storeData, getData } from '../util/storage';

const TextBar = (props) => {
  return (
    <View style={{width:"100%", alignItems:"center", marginBottom:20, marginTop:5}}>
      <TextInput style={styles.input} placeholder={props.placeholder} value={props.inputText} onChangeText={(text)=>props.setInputText(text)}/>
    </View>
  )
}

function BigButton (props) {
  return (
    <TouchableOpacity style={[{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center", borderRadius:20}, props.style]} onPress={props.onPress}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const removeApp = async (id, navigation) => {
  await removeConnection(id);
  Alert.alert("Connection removed!");
  navigation.pop()
}

const editApp = async (id, app_name, link, navigation) => {
  try {
    await editConnection(id, app_name, link);
    Alert.alert("Connection edited!");
    navigation.pop()
  } catch (e) {
    if (isCode(e, [422])) {
    Alert.alert("Edit failed!", "Select an app to connect, and make sure a username is entered for that app.")
    } else {
    throw(e);
    }
  } 
}

function usernameToLink(app_name, username) {
  let base_links = {instagram:"instagram.com", facebook:"facebook.com", twitter:"twitter.com", youtube:"youtube.com"};
  return "https://www." + app_name + ".com/" + username
}

export default function EditApps ({ navigation, route }) {
  const [username, setUsername] = useState(route.params.name)
  const [app, setApp] = useState(route.params.app)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [])

  const data = [
    { label: 'Instagram', value: 'instagram' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Facebook', value: 'facebook' }
  ];


  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>App</Text>
      <DropdownSearch placeholder="App" data={data} function={setApp} dropdownPos={isKeyboardVisible? 'top' : 'bottom'} defaultValue={route.params.app}/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Username</Text>
      <TextBar inputText={username} setInputText={setUsername} placeholder="Your Username"/>
      
      <View style={{flexDirection:'row', width:'50%', justifyContent:'center'}}>
        <BigButton style={styles.bigButtonStyle} text="REMOVE" onPress={
          async () => {
            await removeApp(route.params.id, navigation)
          }
        }/>
        <BigButton style={styles.bigButtonStyle} text="SAVE" onPress={
          async () => {
            await editApp(route.params.id, app, usernameToLink(app, username), navigation);
          }
        }/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius:10,
    padding:10,
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: 'pink',
    width:"50%"
  },
  bigButtonStyle: {
    margin:10
  },
  changePlateState: {
    padding: 10,
    backgroundColor: 'pink',
    borderRadius: 10,
    margin: 10
  },
  dropDownStyle: {
    backgroundColor: 'red',
    height:50,
    width: 100
  }
})