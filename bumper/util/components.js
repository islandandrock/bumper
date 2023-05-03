import { ImageBackground, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from 'react'
import { useFonts } from "expo-font"
import { Dropdown } from 'react-native-element-dropdown'
import { acceptFriend, rejectFriend } from "./requests";

function getPlate(name) {
  switch (name) {
    case "1":
      return require("../assets/plates/oregon/1.png")
    case "2":
      return require("../assets/plates/oregon/2.png")
    case "3":
      return require("../assets/plates/oregon/3.png")
    case "unlinked":
      return require('../assets/plates/unlinked.png')
  }
}

function getTextColors(name) {
  switch (name) {
    case "1":
      return {color:"black", shadowColor:"white"}
    case "2":
      return {color:"#ffcc00", shadowColor:"black"}
    case "3":
      return {color:"white", shadowColor:"black"}
    case "unlinked":
      return {color:"white", shadowColor:"black"}
  }
}

export const LicensePlate = (props) => {
  let plate = props.plate;
  if (plate.length == 6) {
    plate = plate.slice(0, 3) + " " + plate.slice(3);
  }

  console.log("AFD", props.name, "L", props.linked)
  let colors = props.linked ? getTextColors(props.name) : getTextColors("unlinked")
  if (!colors) {
    colors = {color:"black", shadowColor:"white"}
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
      transform: [{scale:props.width/600}]}} source={props.linked ? getPlate(props.name) : getPlate('unlinked')}>
      <Text style={{height:"100%", justifyContent:"center", textAlignVertical:"center", fontSize:170, fontFamily:"LicensePlate", color:colors.color, textShadowColor:colors.shadowColor, textShadowRadius:20, paddingVertical:0}}>{plate}</Text>
    </ImageBackground>
    </View>
  )
}

export const DropdownSearch = (props) => {
  const [value, setValue] = useState(null);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={props.data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={props.placeholder}
        searchPlaceholder="Search..."
        value={value}
        dropdownPosition={props.dropdownPos}
        onChange={item => {
          props.setPlateState(item.value);
          setValue(item.value);
        }}
        renderItem={renderItem}
      />
  )
}


export const UserList = (props) => {
  return (
  <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex:1}}>
    <ScrollView style={{width: "100%"}} nestedScrollEnabled={true}>
      {props.users.map((user) =>
        <TouchableOpacity style={[styles.userList]} key={user.id} onPress={() => props.navigation.navigate("Profile", {id:user.id})}>
          <LicensePlate width={90} plate={user.plate} name={user.plate_state} linked={user.linked} style={{marginRight:20}}/>
          <View style={{flexGrow:1, flexShrink:1}}>
            <Text style={[styles.user, user.name ? {} : {fontStyle:"italic", fontWeight:'normal'}]} numberOfLines={1}>{user.name ? user.name : "[unnamed]"}</Text>
            {props.acceptable ?  <Text style={[styles.user, {fontWeight:"normal"}]}>{"wants to friend you."}</Text> : null}
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
          <View>
          <TouchableOpacity style={{width:100, height:40, marginRight:10, marginBottom:5, backgroundColor:"#ee8888", borderRadius:10, alignItems:"center", justifyContent:"center"}}
            onPress={async () => {await acceptFriend(user.id); props.setUsers(props.users.filter(u => u.id != user.id))}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>ACCEPT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width:100, height:40, marginRight:10, backgroundColor:"#ffbbbb", borderRadius:10, alignItems:"center", justifyContent:"center"}}
            onPress={async () => {await acceptFriend(user.id)}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>DENY</Text>
          </TouchableOpacity>
          </View>
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
  }, 
  dropdown: {
    margin: 16,
    height: 50,
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})
