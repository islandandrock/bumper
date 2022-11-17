import {useState} from 'react'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signIn, isCode } from '../util/requests';
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

export default function SignInScreen ({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Email</Text>
      <TextBar inputText={email} setInputText={setEmail} placeholder="Your email"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Password</Text>
      <TextBar inputText={password} setInputText={setPassword} placeholder="Your password"/>
      
      <BigButton text="SIGN IN" onPress={
        async () => {
          try {
            const [name, id] = await signIn(email, password);
            console.log(name, id)
            await storeData("name", name.toString());
            await storeData("user_id", id.toString());
            Alert.alert("Sign in was successful!");
            navigation.navigate('TabPages');
          } catch (e) {
            if (isCode(e, [422])) {
              Alert.alert("Sign in failed!", "Enter a username, email, and password.")
            } else if (isCode(e, [401])) {
              Alert.alert("Sign in failed!", "Check your email and password.");
            } else {
              throw(e);
            }
          }
        }
      }/>
      <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 40}}>Don't have an account?</Text>
      <TouchableOpacity style={{width:"50%", height:80, backgroundColor:"pink", justifyContent:"center", borderRadius:20}} onPress={()=>navigation.navigate("Sign Up")}>
        <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{"Create Account"}</Text>
      </TouchableOpacity>
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