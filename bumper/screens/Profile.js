import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, Modal, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { getData } from '../util/storage';
import { ScrollView } from 'react-native-gesture-handler';

import { addConnection, addFriend, getConnections, getUser } from '../util/requests';
import getIcon from '../util/icons';

const TextBar = (props) => {
  return (
    <View style={{width:"100%", alignItems:"center", marginBottom:20, marginTop:5}}>
    <TextInput style={styles.input} placeholder={props.placeholder} value={props.inputText} onChangeText={(text)=>props.setInputText(text)}/>
    </View>
  )
  }

const SocialMedia = (props) => {
  let selectable=props.selectable?true:false
  let app = props.app;
  console.log("init", app,props.selectedApp)
  return (
    <TouchableOpacity style={{backgroundColor: props.selectedApp==app?"pink":null, width: '100%', justifyContent: 'flex-start', alignItems:'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10}} onPress={() => {
      if (selectable) {
        console.log("clicked", app)
        props.setSelectedApp(app)
        console.log(app, props.selectedApp);
      } else {
        Linking.openURL(props.link)
      }
    }}>
      <Image source={getIcon(app)} style={{height:48, width:48}} resizeMode="contain"/>
      <View>
        <Text style={{fontSize: 18, fontStyle:'bold', padding:20}}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const StepOne = (props) => {
  return (<View style={{width:"100%", flexGrow:1, flexShrink:1, backgroundColor:"mistyrose"}}>
    <ScrollView style={{width:"100%"}}>
      <SocialMedia selectable={true} name='Instagram' app="instagram" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp}/>
      <SocialMedia selectable={true} name='Facebook' app="facebook" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp}/>
      <SocialMedia selectable={true} name='Twitter' app="twitter" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp}/>
      <SocialMedia selectable={true} name='Youtube' app="youtube" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp}/>
    </ScrollView>
  </View>)
}

const StepTwo = (props) => {
  return (<View style={{width:"100%", flexGrow:1, flexShrink:1, backgroundColor:"mistyrose"}}>
    <Text style={{textAlign:"center", marginVertical:10}}>Enter your {props.selectedApp.charAt(0).toUpperCase() + props.selectedApp.slice(1)} username:</Text>
    <TextBar inputText={props.username} setInputText={props.setUsername} placeholder={"Your username"}/>
  </View>)
}

function usernameToLink(app_name, username) {
  let base_links = {instagram:"instagram.com", facebook:"facebook.com", twitter:"twitter.com", youtube:"youtube.com"};
  return "https://www." + app_name + ".com/" + username
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

const NewAppModal = (props) => {
  const [step, setStep] = useState(1);
  const [nextText, setNextText] = useState("Choose App")

  const [selectedApp, setSelectedApp] = useState(null);
  const [username, setUsername] = useState("")

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.fullCenter}>
      <View style={styles.modalView}>
        <Text style={styles.bigText}>Link a New App</Text>
        <TouchableOpacity style={[styles.exitButton, {alignSelf:"flex-end", marginTop:-40}]}
          onPress={() => props.setModalVisible(!props.modalVisible)}/>
        {
          {1: <StepOne selectedApp={selectedApp} setSelectedApp={setSelectedApp}/>,
          2: <StepTwo username={username} setUsername={setUsername} selectedApp={selectedApp}/>}[step]
        }
        <View style={{backgroundColor:"#ffbab3", flexDirection:"row"}}>
          <TouchableOpacity style={{width:"50%"}} onPress={() => props.setModalVisible(!props.modalVisible)}>
            <Text style={styles.modalOptionText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width:"50%", backgroundColor:selectedApp?null:"lightgrey"}} 
            onPress={async () => {setNextText("Link App");
            if (step < 2) {
              setStep(step+1)
            } else {
              connectApp(selectedApp, usernameToLink(selectedApp, username));
              props.setModalVisible(!props.modalVisible)};
              props.forceReload(!props.reload)}}
            disabled={selectedApp?false:true}>
            <Text style={[styles.modalOptionText, {color:selectedApp?null:"grey"}]}>{nextText}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  )
}


export default function ProfileScreen ( {navigation, route} ) {
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [connectedApps, setConnectedApps] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [reload, forceReload] = useState(false)

  useEffect(() => {
    const asyncFunc = async () => {
      let signedInId = await getData("user_id")
      let signedInUser = await getData("username")
      if (!route.params?.id) {
        if (!route.params) {route.params = {}}
        route.params.id = signedInId;
      }
      if (route.params.id == signedInId) {
        setIsOwnProfile(true);
        route.params.username = signedInUser;
      } else {
        let user = await getUser(route.params.id);
        route.params.username = user.username;
        navigation.setOptions({title:`${route.params.username}'s Profile`})
        navigation.setOptions({
          headerRight: () => (
          <Button onPress={() => addFriend(route.params.id)} title="Add friend" />
          ),
        });
      }
      setUsername(route.params.username);
      setUserId(route.params.id)
      let temp = await getConnections(route.params.id)
      setConnectedApps(temp)
    }

    asyncFunc();
  }, [route.params, reload])
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      
      {modalVisible? <NewAppModal modalVisible={modalVisible} setModalVisible={setModalVisible} forceReload={forceReload} reload={reload}/> : null}

      <View style={{alignItems: 'center', width: '100%', backgroundColor: 'pink'}}>
        <Text style={[styles.bigText, {padding: 40, fontSize:40}]}>License Plate</Text>
        <Text style={[styles.bigText, {padding: 20}]}>{username}</Text>
      </View>
      <Text style={[styles.bigText, {padding: 20}]}>{isOwnProfile? "My" : `${username}'s`} Connections</Text>

      <ScrollView style={{width: "100%"}}>
        {isOwnProfile ?  <TouchableOpacity style={{alignItems:'center', backgroundColor:"pink", borderRadius:10}} onPress={async () => {
          setModalVisible(true);
        }}>
          <Text style={styles.mediumText}>Connect new app</Text>
        </TouchableOpacity> : null}

        {connectedApps.map((connection) => <SocialMedia name={connection.app_name} app={connection.app_name} link={connection.link} key={connection.id}/>)}

      </ScrollView>
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
  fullCenter: {
    justifyContent:"center",
    alignItems:"center",
    height:"100%",
    width:"100%"
  },
  modalView: {
    width:"80%",
    height:"70%",
    backgroundColor:"#ffbab3",
    borderRadius:10,
    overflow:"hidden"
  },
  bigText: {
    textAlign:"center",
    fontWeight:"bold", fontSize:20,
    marginVertical:10
  },
  mediumText: {
    fontSize: 18,
    padding:20
  },
  exitButton: {
    height:40,
    width:40,
    backgroundColor:"red"
  },
  modalOptionText: {
    textAlign:"center",
    fontWeight:"bold",
    marginVertical:10,
    fontSize:15
  }
  
})
