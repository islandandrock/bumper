import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, Modal, TextInput, Button, ImageBackground, Dimensions } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { getData } from '../util/storage';
import { ScrollView } from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CommonActions } from '@react-navigation/native';

import { addConnection, addFriend, getConnections, getFriends, getUser, getCode, acceptFriend, removeFriend, getFriendRequests, cancelFriendRequest } from '../util/requests';
import getIcon from '../util/icons';
import { LicensePlate } from '../util/components';

const Tab = createMaterialTopTabNavigator();

const TextBar = (props) => {
  return (
    <View style={{width:"100%", alignItems:"center", marginBottom:20, marginTop:5}}>
    <TextInput style={styles.input} placeholder={props.placeholder} value={props.inputText} onChangeText={(text)=>props.setInputText(text)}/>
    </View>
  )
  }

const ConnectionList = React.memo(function ConnectionList(props) {
  //console.log("BBBB", props.connectedApps, props.isOwnProfile, props.setModalVisible)
  return (
    <ScrollView style={{width: "100%"}}>
      {props.isOwnProfile ?  <TouchableOpacity style={{alignItems:'center', backgroundColor:"pink", borderRadius:10}} onPress={async () => {
        props.setModalVisible(true);
      }}>
        <Text style={styles.mediumText}>Connect new app</Text>
      </TouchableOpacity> : null}
      {props.connectedApps.length ? 
      props.connectedApps.map(
        (connection) => <SocialMedia
        name={
          `${connection.app_name.slice(0, 1).toUpperCase()+connection.app_name.slice(1)} - @${connection.link.split("/").pop()}`
        }
        app={connection.app_name}
        link={connection.link}
        key={connection.id}/>) :  
      <Text>This user hasn't linked any apps yet!</Text>
      }
     

  </ScrollView>
);
})

const FriendList = React.memo(function FriendList({navigation, route}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      navigation.dispatch(state => {
        // Remove the home route from the stack
        const history = [state.history[state.history.length-1]];

        return CommonActions.reset({
          ...state,
          history,
          index: history.length,
        });
      });
      
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1}}>
      <ScrollView style={{width: "100%"}}>
        {route.params.friends.map((user) => 
          <TouchableOpacity style={[styles.userList]} key={user.id} onPress={() => {navigation.push("Profile", {id:user.id})}}>
            <LicensePlate width={80} plate={user.plate} state={user.linked ? "oregon" : "unlinked"} style={{marginRight:20}}/>
            <View style={{flexGrow:1, flexShrink:1}}>
              <Text style={[styles.user]} numberOfLines={1}>{user.name}</Text>
            </View>
            <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
              <Text style={{fontWeight:"bold", fontSize:20}}>{user.numFriends}</Text>
              <Text style={{marginTop:-5, fontSize:10}}>Friends</Text>
            </View>
            <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
              <Text style={{fontWeight:"bold", fontSize:20}}>{user.numConnections}</Text>
              <Text style={{marginTop:-5, fontSize:10}}>Connections</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
})

const SwipeTabs = React.memo((props) => {
  //console.log("AAAA", props.connectedApps, props.isOwnProfile)
  let connectedApps = props.connectedApps
  let isOwnProfile = props.isOwnProfile
  let setModalVisible = props.setModalVisible
  let friends = props.friends
  let navigation = props.navigation
  return (
    <Tab.Navigator style={{width:"100%", flexGrow:1, backgroundColor:'red', height:10}} screenOptions={{gestureEnabled: false, "tabBarStyle": {"backgroundColor": "#fff0f6"}
   }}>
      <Tab.Screen name="Connections" options={{gestureEnabled: false}}>
        {(props) => <ConnectionList connectedApps={connectedApps} isOwnProfile={isOwnProfile} setModalVisible={setModalVisible}/>}
      </Tab.Screen>
      <Tab.Screen name="Friends" options={{gestureEnabled: false}} initialParams={{ friends:friends }} component={FriendList}/>
    </Tab.Navigator>
  );
})

const SocialMedia = (props) => {
  let selectable = props.selectable?true:false
  let app = props.app;
  //console.log("init", app,props.selectedApp)
  return (
    <TouchableOpacity style={{backgroundColor: props.selectedApp==app?"pink":null, width: '100%', justifyContent: 'flex-start', alignItems:'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10}} onPress={() => {
      if (selectable) {
        //console.log("clicked", app)
        props.setSelectedApp(app)
        //console.log(app, props.selectedApp);
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

// First step
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
          <TouchableOpacity style={{width:"50%", backgroundColor:selectedApp?null:"#d3c9cd"}} 
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
  const [name, setName] = useState("")
  const [userId, setUserId] = useState(null)
  const [plate, setPlate] = useState({linked:false, plate:""});
  const [modalVisible, setModalVisible] = useState(false);
  const [connectedApps, setConnectedApps] = useState([]);
  const [friends, setFriends] = useState([])
  const [friended, setFriended] = useState(false)
  const [outgoing, setOutgoing] = useState(false)
  const [incoming, setIncoming] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [reload, forceReload] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [bio, setBio] = useState("this is a user with a really really really long description for some reason like its so so so so long")
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    //console.log("params", route.params, "reload", reload)
    let newId = null;
    let newName = null;
    let newBio = null;
    const asyncFunc = async () => {
      let signedInId = await getData("user_id")
      let signedInUser = await getData("name")
      if (!route.params?.id) {
        newId = signedInId;
      } else {
        newId = route.params.id;
      }
      let user = await getUser(newId);
      setIncoming(user.incoming)
      setOutgoing(user.outgoing)
      newName = user.name;
      newBio = user.bio;
      if (newId == signedInId) {
        setIsOwnProfile(true);
        navigation.setOptions({title:user.plate})        
        setPlate({linked:user.linked,plate:user.plate})
      } else {
        setPlate({linked:user.linked,plate:user.plate})
        setFriended(user.friended)
        newName = user.name;
        navigation.setOptions({title:user.plate})
      }
      
      setName(newName);
      setUserId(newId);
      setBio(newBio);
      let temp = await getConnections(newId);
      setConnectedApps(temp);
      setFriends(await getFriends(newId));
      setLoaded(true);
      setBusy(false);
    }
    asyncFunc();

    const unsubscribe = navigation.addListener('focus', () => {
      //if (editMode) { FIX THIS
        setEditMode(false)
        console.log("reloding")
        forceReload(!reload)
      //}
    });

    return unsubscribe;

  }, [route.params, reload])

  const onTextLayout = useCallback(e => {
    if (e.nativeEvent.lines.length > 4) {
      let newText = ""
      for (let i = 0; i < 4; i++) {
        newText += e.nativeEvent.lines[i].text
      }
      setBio(newText)
    }
  }, []);

  const dimensions = Dimensions.get('window')
  
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor:"#fff0f6"}}>
      
      {modalVisible? <NewAppModal modalVisible={modalVisible} setModalVisible={setModalVisible} forceReload={forceReload} reload={reload}/> : null}

      {loaded ?
        <View style={{flexDirection:"row", width:dimensions.width-40, marginTop:20}}>
          <View style={{width:2*(dimensions.width-40)/3}}>
            <LicensePlate width={2*(dimensions.width-40)/3} plate={plate.plate} state={plate.linked ? "oregon" : "unlinked"}/>
            <View style={{backgroundColor:'#d3c9cd', marginTop:10, borderRadius:10, padding:5}}>
              <Text style={[styles.bigText, {textAlign:"left", fontSize: 17, marginTop: 0, marginBottom: 0, width:"100%"}]}>{name}</Text>
              <Text numberOfLines={4} style={[styles.bigText, {textAlign:"left", fontSize: 17, fontWeight:'normal', marginTop: 0, marginBottom: 0, marginLeft:0, width:"100%"}]}>{bio}</Text>
            </View>
          </View>
          <View style={{flexGrow:1, backgroundColor:'#d3c9cd', borderRadius:10, justifyContent:'center', alignItems:'center', marginLeft:10}}>
            <View style={{width:80, flexGrow:1, justifyContent:"center", alignItems:"center"}}>
              <Text style={{fontWeight:"bold", fontSize:24}}>{friends.length}</Text>
              <Text style={{marginTop:-5}}>Friends</Text>

            </View>
            <View style={{width:80, flexGrow:1, justifyContent:"center", alignItems:"center"}}>
              <Text style={{fontWeight:"bold", fontSize:24}}>{connectedApps.length}</Text>
              <Text style={{marginTop:-5}}>Connections</Text>
            </View>
          </View>
        </View>
      : null}
      {loaded ? !isOwnProfile ? !friended ? !incoming ? !outgoing ?
        <TouchableOpacity style={{width:dimensions.width-40, borderRadius:10, marginTop:10, height:30, justifyContent:"center", backgroundColor:"#ee5d97"}} onPress={async () => {if (!busy) {setBusy(true); await addFriend(userId); forceReload(!reload); setBusy(false)}}}>
          <Text style={{fontWeight:"bold", fontSize:15, alignSelf:"center"}}>Add Friend</Text>
        </TouchableOpacity>
      :
        <TouchableOpacity style={{width:dimensions.width-40, borderRadius:10, marginTop:10, height:30, justifyContent:"center", backgroundColor:"#EDCAD8"}} onPress={async () => {if (!busy) {setBusy(true); await cancelFriendRequest(userId); forceReload(!reload); setBusy(false)}}}>
          <Text style={{fontWeight:"bold", fontSize:15, alignSelf:"center"}}>Cancel Friend Request</Text>
        </TouchableOpacity>
      :
      <TouchableOpacity style={{width:dimensions.width-40, borderRadius:10, marginTop:10, height:30, justifyContent:"center", backgroundColor:"#ee5d97"}} onPress={async () => {if (!busy) {setBusy(true); await acceptFriend(userId); forceReload(!reload); setBusy(false)}}}>
        <Text style={{fontWeight:"bold", fontSize:15, alignSelf:"center"}}>Accept Friend Request</Text>
      </TouchableOpacity>
      :
        <TouchableOpacity style={{width:dimensions.width-40, borderRadius:10, marginTop:10, height:30, justifyContent:"center", backgroundColor:"#EDCAD8"}} onPress={async () => {if (!busy) {setBusy(true); await removeFriend(userId); forceReload(!reload); setBusy(false)}}}>
          <Text style={{fontWeight:"bold", fontSize:15, alignSelf:"center"}}>Remove Friend</Text>
        </TouchableOpacity>
      : 
      <TouchableOpacity style={{width:dimensions.width-40, borderRadius:10, marginTop:10, height:30, justifyContent:"center", backgroundColor:"#ee5d97"}} onPress={async () => {setEditMode(true); navigation.navigate("EditProfile", {name:name, bio:bio, plate:plate}); forceReload(!reload)}}>
        <Text style={{fontWeight:"bold", fontSize:15, alignSelf:"center"}}>Edit Profile</Text>
      </TouchableOpacity>
      : null }
      {loaded ? 
      <SwipeTabs connectedApps={connectedApps} isOwnProfile={isOwnProfile} setModalVisible={setModalVisible} friends={friends} navigation={navigation}/> :
      null}
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
  }, 
  userList: {
    marginVertical:5,
    width: '100%',
    padding:5,
    paddingLeft:20,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
    borderRadius: 10,
    flexDirection:'row',
    alignItems:'center'
  },
  user: {
    fontSize: 20,
    fontWeight: 'bold',
  }
  
})
