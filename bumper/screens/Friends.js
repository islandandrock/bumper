import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { getData } from '../util/storage';


const SearchBar = (props) => {
    return (
        <View>
            <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
        </View>

    )

}

let Friends = [
    {name: "brian", lat: 2, lon: 2, link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', key: 1},
    {name: "theo", lat: 1, lon: 1, link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', key: 2},
]

const Pins = Friends.map((Friends) => <Marker onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} key={Friends.key} coordinate={{latitude: Friends.lat, longitude: Friends.lon}} pinColor={'pink'}>
    <Text style={{backgroundColor: 'pink', borderRadius: 100, padding: 5}}>{Friends.name}</Text></Marker>)


export default function FriendScreen () {
    const [SearchText, SetSearchText] = useState('');
    const [ListMode, SetListMode] = useState(true)


    return (
        <View>
            <View style={styles.container}>
                <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
                <TouchableOpacity style={styles.toggle} onPress={() => SetListMode(!ListMode)}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Toggle Mode</Text>
                </TouchableOpacity>
            </View>
            {ListMode ? 
            (

                <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <FlatList data={[
                        {key: 'thing'},
                        {key: 'though'},
                        {key: 'thos'},
                        {key: 'other'}
                    ]} 
                    renderItem={({item}) => <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}><Text style={styles.friend}>{item.key}</Text></TouchableOpacity>}/>
                </View>
            ):(
                <View style={{justifyContent: 'center', flexDirection: 'column'}}>
                    <MapView     initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                    }} style={styles.map}>
                                {Pins}
                    </MapView>
                </View>
            )}
        </View>
    )
}

const dude = {
    name:'dude',
    age:'100',
    socialMedias:'https//something'
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },

    marker: {
        backgroundColor: 'pink',
    },

    toggle: {
        backgroundColor:'pink',
        padding: 10,
        borderRadius: 10
    },

    input: {
        borderRadius:10,
        padding:10,
        backgroundColor: '#fff',
        borderWidth:1,
        borderColor: 'pink'
    },

    map: {
        width: '100%',
        height: '100%',
        borderRadius:10,
        marginRight:10,
        justifyContent:'center'
    },

    friend: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        padding:10,
        paddingLeft:20,
        backgroundColor: '#FFDADA',
        borderBottomColor: 'black',
    }
})