import {useState} from 'react'
import { Dropdown } from 'react-native-element-dropdown'
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
  const [plate, setPlate] = useState(route.params.plate.linked ? route.params.plate.plate : '')
  const [plateState, setPlateState] = useState(route.params.plateState)
  const [selected, setSelected] = useState(undefined);

    
  const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
  ]

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Name</Text>
      <TextBar inputText={name} setInputText={setName} placeholder="Your name"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Bio</Text>
      <TextBar inputText={bio} setInputText={setBio} placeholder="Your bio"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Plate</Text>
      <TextBar inputText={plate} setInputText={setPlate} placeholder="Your license plate"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Plate State</Text>
      <View style={{backgroundColor: 'red', width:'100%', alignItems:'center'}}>
        {/*
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('oregon')}><Text style={{fontSize: 20}}>Oregon</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('california')}><Text style={{fontSize: 20}}>California</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('unlinked')}><Text style={{fontSize: 20}}>Unlinked</Text></TouchableOpacity>
        */}
        <Dropdown label="jkldfsaljk;fdaljkdfsjlk;" data={data} onSelect={setSelected}/>
      </View>
      
      <BigButton text="SAVE" onPress={
        async () => {
          try {
            await updateUser(name, bio, plate, plateState);
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
  },
  dropDownStyle: {
    backgroundColor: 'red',
    height:50,
    width: 100
  }
})