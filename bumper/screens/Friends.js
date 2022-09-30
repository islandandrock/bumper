import {View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking} from 'react-native';
import {useState} from 'react'
import MapView from 'react-native-maps';

const SearchBar = (props) => {
    return (
        <View>
            <TextInput style={styles.input} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
        </View>

    )

}


export default function FriendScreen () {
    const [SearchText, SetSearchText] = useState('');
    const [ListMode, SetListMode] = useState(true)
    const friends = [dude, dude, dude]

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
                <View>
                    <MapView     initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                    }}style={styles.map}/>
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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