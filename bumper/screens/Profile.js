import {View, Text} from 'react-native';
import { StyleSheet, Image } from 'react-native';
import {TouchableOpacity, Linking} from 'react-native';

const SocialMedia = (props) => {
    return (
        <TouchableOpacity style={{width: '100%', justifyContent: 'flex-start', flexDirection: 'row', padding: 10}} onPress={() => Linking.openURL(props.link)}>
            <Image source={require('../assets/favicon.png')}/>
            <View>
                <Text style={{fontSize: 18, fontStyle:'bold', padding:20}}>{props.name}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default function ProfileScreen () {
    return (
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', height: 220, backgroundColor: 'pink'}}>
                <Text style={{fontSize: 40, fontWeight: 'bold', padding: 40}}>License Plate</Text>
                <View style={{flexDirection: 'row', width: '100%', backgroundColor: 'pink', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', padding: 20}}>Your Name</Text>
                </View>
            </View>
            <View style={{width: '100%'}}>
                <SocialMedia name='@Placeholder' link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                <SocialMedia name='@Placeholder' link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
                <SocialMedia name='@Placeholder' link='https://www.youtube.com/watch?v=dQw4w9WgXcQ'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchStyle
})