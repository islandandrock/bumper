import {View, Text, TextInput} from 'react-native';
import {useState} from 'react'

const SearchBar = (props) => {
    return (
        <View>
            <TextInput styles={{backgroundColor: 'red'}} placeholder='Search' value={props.SearchText} onChangeText={(text)=>props.SetSearchText(text)}/>
        </View>

    )

}


export default function FriendScreen () {
    const [SearchText, SetSearchText] = useState('');
    return (
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <SearchBar SearchText={SearchText} SetSearchText={SetSearchText}/>
        </View>
    )
}