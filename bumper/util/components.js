import { ImageBackground, Text, View } from "react-native";
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