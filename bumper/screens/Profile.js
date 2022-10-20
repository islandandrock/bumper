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
    app = props.app;
    if (!app) {
        app = "instagram"
    }
    return (
        <TouchableOpacity style={{width: '100%', justifyContent: 'flex-start', alignItems:'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10}}>
            <Image source={getIcon(app)} style={{height:48, width:48}} resizeMode="contain"/>
            <View>
                <Text style={{fontSize: 18, fontStyle:'bold', padding:20}}>{props.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const NewAppModal = (props) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!props.modalVisible);
            }}
            style={{alignContent:"center", alignItems:"center", justifyContent:"center"}}
        >
            <View style={{justifyContent:"center", alignItems:"center", height:"100%", width:"100%"}}>
            <View style={{width:"80%", height:"70%", backgroundColor:"lightpink", borderRadius:10, overflow:"hidden"}}>
                <TouchableOpacity style={{height:40, width:40, backgroundColor:"red", alignSelf:"flex-end", marginBottom:-40}} onPress={() => props.setModalVisible(!props.modalVisible)}></TouchableOpacity>
                <Text style={{textAlign:"center", fontWeight:"bold", fontSize:20, marginVertical:10}}>Link a New App</Text>
                <TouchableOpacity
                    style={{}}
                    onPress={() => props.setModalVisible(!props.modalVisible)}>
                    <Text>Hide Modal</Text>
                </TouchableOpacity>
                <View style={{width:"100%", flexGrow:1, flexShrink:1, backgroundColor:"mistyrose"}}>
                    <ScrollView style={{width:"100%"}}>
                    <SocialMedia name='Instagram' app="instagram" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Facebook' app="facebook" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Twitter' app="twitter" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Youtube' app="youtube" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Youtube' app="youtube" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Youtube' app="youtube" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    <SocialMedia name='Youtube' app="youtube" link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                    </ScrollView>
                
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
            
            <NewAppModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>

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
                    <View>
                        <Text style={{fontSize: 18, fontStyle:'bold', padding:20}}>Connect new app</Text>
                    </View>
                </TouchableOpacity>

                <SocialMedia name='@Placeholder' link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                <SocialMedia name='@Placeholder' link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    
})