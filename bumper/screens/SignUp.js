import {useState} from 'react'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signUp, isCode } from '../util/requests';

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

export default function SignUpScreen () {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Email</Text>
      <TextBar inputText={email} setInputText={setEmail} placeholder="Your email"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Username</Text>
      <TextBar inputText={username} setInputText={setUsername} placeholder="Your new username"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Password</Text>
      <TextBar inputText={password} setInputText={setPassword} placeholder="Your new password"/>
      
      <BigButton text="SIGN UP" onPress={
        async () => {
          try {
            await signUp(email, username, password);
            Alert.alert("Sign up was successful!");
            //navigation.navigate('Sign In');
          } catch (e) {
            if (isCode(e, [422])) {
              Alert.alert("Sign up failed!", "Enter a username, email, and password.")
            } else if (isCode(e, [409])) {
              Alert.alert("Sign up failed!", e.description);
            } else {
              throw(e);
            }
          }
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
    width:"80%"
  },
})