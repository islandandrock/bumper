import {View, Text, TouchableOpacity} from 'react-native';

export default function PlateLookupScreen () {
  return (
    <View style={{flex: 1, width:"100%", justifyContent: "flex-start", alignItems: 'center'}}>
      <View style={{flexDirection:"row", width:"100%", justifyContent:"center"}}>
        <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink"}}>
          <View style={{justifyContent:"center", alignContent:"center", width:"100%", height:"100%"}}>
            <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>TAKE PICTURE</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink"}}>
          <View style={{justifyContent:"center", alignContent:"center", width:"100%", height:"100%"}}>
            <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>ENTER PLATE</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}