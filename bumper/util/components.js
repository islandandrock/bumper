import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { useState } from 'react'
import { useFonts } from "expo-font"
import { Dropdown } from 'react-native-element-dropdown'



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
      transform: [{scale:props.width/600}]}} source={getPlate(props.name)}>
      <Text style={{fontSize:170, fontFamily:"LicensePlate", color:props.name=="oregon"?"black":"white", textShadowColor:props.name=="oregon"?"white":"black", textShadowRadius:20, paddingVertical:0}}>{plate}</Text>
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

const styles = StyleSheet.create({
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
});