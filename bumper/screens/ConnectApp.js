import {useState, useEffect} from 'react'
import { DropdownSearch } from '../util/components'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { signIn, updateUser, isCode, addConnection } from '../util/requests';
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
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center", borderRadius:20}} onPress={props.onPress}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const connectApp = async (app_name, link) => {
  try {
    await addConnection(app_name, link);
    Alert.alert("App connected!");
  } catch (e) {
    if (isCode(e, [422])) {
    Alert.alert("Connection failed!", "Link a valid account.")
    } else {
    throw(e);
    }
  } 
}

function usernameToLink(app_name, username) {
  let base_links = {instagram:"instagram.com", facebook:"facebook.com", twitter:"twitter.com", youtube:"youtube.com"};
  return "https://www." + app_name + ".com/" + username
}

export default function ConnectApp ({ navigation, route }) {
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

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20, marginVertical:20}}>Link an external account so people can contact you elsewhere!</Text>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>App</Text>
      <DropdownSearch placeholder="App" data={data} function={setApp} style={{
          margin: 16,
          height: 50,
          width: '50%',
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
        }} dropdownPos={isKeyboardVisible? 'top' : 'bottom'}/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Username</Text>
      <TextBar inputText={username} setInputText={setUsername} placeholder="Your Username"/>
      
      <BigButton text="SAVE" onPress={
        async () => {
          await connectApp(app, usernameToLink(app, username));
          Alert.alert("Linked Connections!");
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
    height:50,
    width: 100
  }
})