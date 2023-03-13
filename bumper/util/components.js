import { ImageBackground, Text, View } from "react-native";
import { useFonts } from "expo-font"

function getPlate(name) {
  switch (name) {
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
      transform: [{scale:props.width/600}]}} source={getPlate(props.name)}>
      <Text style={{fontSize:170, fontFamily:"LicensePlate", color:props.name=="oregon"?"black":"white", textShadowColor:props.name=="oregon"?"white":"black", textShadowRadius:20, paddingVertical:0}}>{plate}</Text>
    </ImageBackground>
    </View>
  )
}