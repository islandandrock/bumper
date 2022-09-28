import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {useState} from 'react'

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
                <View>
                    <Text>list</Text>
                </View>
            ):(
                <View>
                    <Text>map</Text>
                </View>
            )}
        </View>
    )
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
    }
})