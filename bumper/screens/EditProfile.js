import {useState, useEffect} from 'react'
import { DropdownSearch } from '../util/components'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [])

    
  const data = [
    { label: 'Oregon', value: 'oregon' },
    { label: 'California', value: 'california' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
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
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Name</Text>
      <TextBar inputText={name} setInputText={setName} placeholder="Your name"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Bio</Text>
      <TextBar inputText={bio} setInputText={setBio} placeholder="Your bio"/>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Plate</Text>
      <TextBar inputText={plate} setInputText={setPlate} placeholder="Your license plate"/>
      <View style={{ width:'100%', alignItems:'center'}}>
        {/*
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('oregon')}><Text style={{fontSize: 20}}>Oregon</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('california')}><Text style={{fontSize: 20}}>California</Text></TouchableOpacity>
        <TouchableOpacity style={styles.changePlateState} onPress={() => setPlateState('unlinked')}><Text style={{fontSize: 20}}>Unlinked</Text></TouchableOpacity>
        */}
        <DropdownSearch placeholder="Plate State" data={data} setPlateState={setPlateState} dropdownPos={isKeyboardVisible? 'top' : 'auto'}/>
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