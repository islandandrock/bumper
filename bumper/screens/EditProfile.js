import {useState} from 'react'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signIn, updateUser, isCode } from '../util/requests';
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

export default function EditProfileScreen ({ navigation, route }) {
  const [name, setName] = useState(route.params.name)
  const [bio, setBio] = useState(route.params.bio)
  const [plate, setPlate] = useState(route.params.plate.linked ? route.params.plate.plate : "")

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Name</Text>
      <TextBar inputText={name} setInputText={setName} placeholder="Your name"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Bio</Text>
      <TextBar inputText={bio} setInputText={setBio} placeholder="Your bio"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Plate</Text>
      <TextBar inputText={plate} setInputText={setPlate} placeholder="Your license plate"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Plate State</Text>
      <View style={{flexDirection:'row', }}>
        <TouchableOpacity style={styles.changePlateState} onPress={() => updateUser(name, bio, plate, 'oregon')}><Text style={{fontSize: 20}}>Oregon</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => updateUser(name, bio, plate, 'california')}><Text style={{fontSize: 20}}>California</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => updateUser(name, bio, plate, 'unlisted')}><Text style={{fontSize: 20}}>Unlisted</Text></TouchableOpacity>
      </View>
      
      <BigButton text="SAVE" onPress={
        async () => {
          try {
            await updateUser(name, bio, plate);
            Alert.alert("Updated your profile!");
            navigation.pop();
          } catch (e) {
            if (isCode(e, [409])) {
              Alert.alert("Plate update failed!", "Someone has already linked this license plate.")
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
  changePlateState: {
    padding: 10,
    backgroundColor: 'pink',
    borderRadius: 10,
    margin: 10
  }
})