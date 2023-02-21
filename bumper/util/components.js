import { ImageBackground, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font"

function getPlate(state) {
  switch (state) {
    case "oregon":
      return require("../assets/plates/oregon.png")
    case "california":
      return require("../assets/plates/california.png")
    case "unlinked":
      return require("../assets/plates/unlinked.png")
  }
}

export const LicensePlate = (props) => {
  let plate = props.plate;
  if (plate.length == 6) {
    plate = plate.slice(0, 3) + " " + plate.slice(3);
  }

  const [loaded] = useFonts({
    LicensePlate: require('../assets/fonts/LicensePlate-j9eO.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={props.style}>
    <ImageBackground imageStyle={{resizeMode:"contain"}} style={{alignItems: 'center',
      justifyContent:'center',
      alignContent:'center',
      width: 600, height: 300,
      backgroundColor: 'pink',
      marginVertical: -(150-props.width/4),
      marginHorizontal: -(300-props.width/2),
      transform: [{scale:props.width/600}]}} source={getPlate(props.state)}>
      <Text style={{fontSize:170, fontFamily:"LicensePlate", color:props.state=="oregon"?"black":"white", textShadowColor:props.state=="oregon"?"white":"black", textShadowRadius:20, paddingVertical:10}}>{plate}</Text>
    </ImageBackground>
    </View>
  )
}

export const UserList = (props) => {
  return (
  <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1}}>
    <ScrollView style={{width: "100%"}}>
      {props.users.map((user) =>
        <TouchableOpacity style={[styles.userList]} key={user.id} onPress={() => props.navigation.navigate("Profile", {id:user.id})}>
          <LicensePlate width={90} plate={user.plate} state={user.linked ? "oregon" : "unlinked"} style={{marginRight:20}}/>
          <View style={{flexGrow:1, flexShrink:1}}>
            <Text style={[styles.user]} numberOfLines={1}>{user.name}</Text>
          </View>
          {!props.acceptable ?
          <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>{user.numFriends}</Text>
            <Text style={{marginTop:-5, fontSize:10}}>Friends</Text>
          </View>
          : null}
          {!props.acceptable ?
          <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>{user.numConnections}</Text>
            <Text style={{marginTop:-5, fontSize:10}}>Connections</Text>
          </View>
          :
          <TouchableOpacity style={{width:100, height:45, marginRight:10, backgroundColor:"#ee8888", borderRadius:10, alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>ACCEPT</Text>
          </TouchableOpacity>
          }
        </TouchableOpacity>
      )}
    </ScrollView>
  </View>)
}



const styles = StyleSheet.create({
  userList: {
    width: '100%',
    padding:5,
    paddingLeft:10,
    backgroundColor: '#FFDADA',
    borderBottomColor: 'black',
    flexDirection:'row',
    alignItems:'center',
    marginVertical:3,
    borderRadius:10
  },

  user: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})