import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { getData } from '../util/storage';
import { ScrollView } from 'react-native-gesture-handler';

import { addConnection } from '../util/requests';
import getIcon from '../util/icons';

const x = async () => {
    try {
        await addConnection("Instagram", "instagram.com");
        Alert.alert("App connected!");
    } catch (e) {
        if (isCode(e, [422])) {
        Alert.alert("Connection failed!", "Link a valid account.")
        } else {
        throw(e);
        }
    } 
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
        <SocialMedia selectable={true} name='Instagram' app="instagram" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp} link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
        <SocialMedia selectable={true} name='Facebook' app="facebook" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp} link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
        <SocialMedia selectable={true} name='Twitter' app="twitter" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp} link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
        <SocialMedia selectable={true} name='Youtube' app="youtube" selectedApp={props.selectedApp} setSelectedApp={props.setSelectedApp} link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
        </ScrollView>
    </View>)
}



const NewAppModal = (props) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [step, setStep] = useState(1);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.setModalVisible(!props.modalVisible);
            }}
            style={{alignContent:"center", alignItems:"center", justifyContent:"center"}}
        >
            <View style={{justifyContent:"center", alignItems:"center", height:"100%", width:"100%"}}>
            <View style={{width:"80%", height:"70%", backgroundColor:"#ffbab3", borderRadius:10, overflow:"hidden"}}>
                <Text style={{textAlign:"center", fontWeight:"bold", fontSize:20, marginVertical:10}}>Link a New App</Text>
                <TouchableOpacity style={{height:40, width:40, backgroundColor:"red", alignSelf:"flex-end", marginTop:-40}}
                    onPress={() => props.setModalVisible(!props.modalVisible)}/>
                <View style={{height:"100%", width:"100%", backgroundColor:"red"}}>
                {
                    {1: <StepOne style={{width:"100%", flexGrow:1, flexShrink:1, backgroundColor:"mistyrose"}} selectedApp={selectedApp} setSelectedApp={setSelectedApp}/>,
                    2: <Text>hi</Text>}[step]
                }
                <View style={{width:"100%", backgroundColor:"#ffbab3", flexDirection:"row"}}>
                    <TouchableOpacity style={{width:"50%", height:"100%"}} onPress={() => props.setModalVisible(!props.modalVisible)}>
                        <Text style={{textAlign:"center", fontWeight:"bold", marginVertical:10}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"50%", height:"100%", backgroundColor:selectedApp?null:"lightgrey"}} onPress={()=>{console.log("hi")}} disabled={selectedApp?false:true}>
                        <Text style={{textAlign:"center", fontWeight:"bold", marginVertical:10, color:selectedApp?null:"grey"}}>Choose App</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            </View>
        </Modal>
    )
}


export default function ProfileScreen () {
    const [username, setUsername] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const asyncFunc = async () => {
          setUsername(await getData("username"));
        }
        asyncFunc();
    }, [])
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            
            {modalVisible? <NewAppModal modalVisible={modalVisible} setModalVisible={setModalVisible}/> : null}

            <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', height: 220, backgroundColor: 'pink'}}>
                <Text style={{fontSize: 40, fontWeight: 'bold', padding: 40}}>License Plate</Text>
                <View style={{flexDirection: 'row', width: '100%', backgroundColor: 'pink', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', padding: 20}}>{username}</Text>
                </View>
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold', padding: 20}}>My Connections</Text>

            <ScrollView style={{width: "100%", height: "100%"}}>
                <TouchableOpacity style={{width: '100%', justifyContent: 'center', alignItems:'center', flexDirection: 'row', paddingHorizontal: 10, backgroundColor:"pink", borderRadius:10}} onPress={async () => {
                    setModalVisible(true);
                }}>
                    <Text style={{fontSize: 18, fontStyle:'bold', padding:20}}>Connect new app</Text>
                </TouchableOpacity>

                <SocialMedia name='@Placeholder' app="instagram" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                <SocialMedia name='@Placeholder' app="youtube" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    
})