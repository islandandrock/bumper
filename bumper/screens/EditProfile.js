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
    { label: 'Alabama', value: 'alabama' },
    { label: 'Alaska', value: 'alaska' },
    { label: 'Arizona', value: 'arizona' },
    { label: 'Arkansas', value: 'arkansas' },
    { label: 'California', value: 'california' },
    { label: 'Colorado', value: 'colorado' },
    { label: 'Connecticut', value: 'connecticut' },
    { label: 'Delaware', value: 'delaware' },
    { label: 'Florida', value: 'florida' },
    { label: 'Georgia', value: 'georgia' },
    { label: 'Hawaii', value: 'hawaii' },
    { label: 'Idaho', value: 'idaho' },
    { label: 'Illinois', value: 'illinois' },
    { label: 'Indiana', value: 'indiana' },
    { label: 'Iowa', value: 'iowa' },
    { label: 'Kansas', value: 'kansas' },
    { label: 'Kentucky', value: 'kentucky' },
    { label: 'Louisiana', value: 'louisiana' },
    { label: 'Maine', value: 'maine' },
    { label: 'Maryland', value: 'maryland' },
    { label: 'Massachusetts', value: 'massachusetts' },
    { label: 'Michigan', value: 'michigan' },
    { label: 'Minnesota', value: 'minnesota' },
    { label: 'Mississippi', value: 'mississippi' },
    { label: 'Missouri', value: 'missouri' },
    { label: 'Montana', value: 'montana' },
    { label: 'Nebraska', value: 'nebraska' },
    { label: 'Nevada', value: 'nevada' },
    { label: 'New Hampshire', value: 'new hampshire' },
    { label: 'New Jersey', value: 'new jersey' },
    { label: 'New Mexico', value: 'new mexico' },
    { label: 'New York', value: 'new york' },
    { label: 'North Carolina', value: 'north carolina' },
    { label: 'North Dakota', value: 'north dakota' },
    { label: 'Ohio', value: 'ohio' },
    { label: 'Oklahoma', value: 'oklahoma' },
    { label: 'Oregon', value: 'oregon' },
    { label: 'Pennsylvania', value: 'pennsylvania' },
    { label: 'Rhode Island', value: 'rhode island' },
    { label: 'South Carolina', value: 'south carolina' },
    { label: 'South Dakota', value: 'south dakota' },
    { label: 'Tennessee', value: 'tennessee' },
    { label: 'Texas', value: 'texas' },
    { label: 'Utah', value: 'utah' },
    { label: 'Vermont', value: 'vermont' },
    { label: 'Virginia', value: 'virginia' },
    { label: 'Washington', value: 'washington' },
    { label: 'Washington DC', value: 'washingtondc' },
    { label: 'West Virginia', value: 'west virigina' },
    { label: 'Wisconsin', value: 'wisconsin' },
    { label: 'Wyoming', value: 'wyonming' },
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
        <DropdownSearch placeholder="Plate State" data={data} setPlateState={setPlateState} dropdownPos={isKeyboardVisible? 'top' : 'bottom'}/>
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