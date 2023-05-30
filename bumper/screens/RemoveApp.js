import {useState, useEffect} from 'react'
import { DropdownSearch } from '../util/components'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { signIn, updateUser, isCode, addConnection } from '../util/requests';
import { storeData, getData } from '../util/storage';


function BigButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center", borderRadius:20}} onPress={props.onPress}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default function RemoveApp ({ navigation, route }) {
  const [username, setUsername] = useState()
  const [app, setApp] = useState()
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
      <DropdownSearch placeholder="App" data={data} function={setApp} dropdownPos={isKeyboardVisible? 'top' : 'bottom'}/>
      
      <BigButton text="REMOVE" onPress={
        async () => {
          //theo do your stuff
          Alert.alert("Removed Connections!");
          navigation.pop();
        }
      }/>
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