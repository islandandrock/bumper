import {useState} from 'react'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signIn, isCode } from '../util/requests';
import { storeData, getData } from '../util/storage';
import { useEffect } from 'react'

const TextBar = (props) => {
  return (
    <View style={{width:"100%", alignItems:"center", marginBottom:20, marginTop:5}}>
      <TextInput secureTextEntry={props.hidden} style={styles.input} placeholder={props.placeholder} value={props.inputText} onChangeText={(text)=>props.setInputText(text)}/>
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
  useEffect (() => {
    const asyncFunc = async () => {
      let temp_email = ""
      let temp_password = ""
      let auto_login = false
      try {
        temp_email = await getData("saved_email")
        temp_password = await getData("saved_password")
        auto_login = await getData("auto_login")
      } catch (e) {}
      if (temp_email && temp_password) {
        if (auto_login == "true") {
          try {
            const [name, id] = await signIn(temp_email, temp_password);
            await storeData("name", name ? name.toString() : "");
            await storeData("user_id", id.toString());
            Alert.alert("Sign in was successful!");
            navigation.navigate('TabPages');
          } catch (e) {
            if (isCode(e, [422])) {
              Alert.alert("Automatic sign in failed!", "Enter your email and password.")
            } else if (isCode(e, [401])) {
              Alert.alert("Automatic sign in failed!", "Please re-enter your email and password.");
            } else if (isCode(e, [400])) {
              Alert.alert("Account not activated yet!", "Please enter the activation code from your email.");
              navigation.navigate("Verify Email");
            } else {
              throw(e);
            }
          }
        } else {
          setEmail(temp_email)
          setPassword(temp_password)
        }
      }
    }
    asyncFunc();
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Email</Text>
      <TextBar inputText={email} setInputText={setEmail} placeholder="Your email"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Password</Text>
      <TextBar inputText={password} hidden={true} setInputText={setPassword} placeholder="Your password"/>
      
      <BigButton text="SIGN IN" onPress={
        async () => {
          try {
            const [name, id] = await signIn(email, password);
            console.log(name, id)
            await storeData("name", name ? name.toString() : "");
            await storeData("user_id", id.toString());
            await storeData("saved_email", email)
            await storeData("saved_password", password)
            await storeData("auto_login", "true")
            navigation.navigate('TabPages');
          } catch (e) {
            if (isCode(e, [422])) {
              Alert.alert("Sign in failed!", "Enter an email and password.")
            } else if (isCode(e, [401])) {
              Alert.alert("Sign in failed!", "Check your email and password.");
            } else if (isCode(e, [400])) {
              Alert.alert("Account not activated yet!", "Please enter the activation code from your email.");
              navigation.navigate("Verify Email");
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