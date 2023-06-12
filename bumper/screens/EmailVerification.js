import {useState, useEffect} from 'react'
import { View, Text, SafeAreaView, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { sendVerification, isCode, checkVerification } from '../util/requests';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const UnderlineExample = (props) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    const asyncFunc = async () => {
      await sendVerification()
    }
    asyncFunc();
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={[styles.title, {fontSize: 25}]}>You still need to verify your email... Check your spam folders for the email if you can't find it!</Text>
      <CodeField
        ref={ref}
        {...props1}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <View style={{height:100}}/>
      <View style={{width:"100%", alignItems:"center"}}>
      <BigButton onPress={async () => {
          try {
            await checkVerification(value);
            Alert.alert("Sign up was successful!", "Enter your new info and get started with Bumper!");
            props.navigation.pop(2);
          } catch (e) {
            if (isCode(e, [400])){
              Alert.alert("Verification failed!", "Make sure you entered the code from your email correctly!")
            } else if (isCode(e, [500])){
              Alert.alert("Verification failed!", "Our verify app is overloaded, try again later...")
            } else {
              throw(e)
            }
          }
        }} text={"VERIFY"}/>
      </View>
    </SafeAreaView>
  );
};
const TextBar = (props) => {
  return (
    <View style={{width:"100%", alignItems:"center", marginBottom:20, marginTop:5}}>
      <TextInput style={styles.input} placeholder={props.placeholder} value={props.inputText} onChangeText={(text)=>props.setInputText(text)}/>
    </View>
  )
}

function BigButton (props) {
  return (
    <TouchableOpacity style={{width:"50%", height:100, backgroundColor:"pink", justifyContent:"center", borderRadius:20}} onPress={props.onPress}>
      <Text style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default function EmailVerificationScreen ({ navigation }) {
  const [code, setCode] = useState("")

  return (
    <UnderlineExample navigation={navigation}/>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius:10,
    padding:10,
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: 'pink',
    width:"80%"
  },
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
})
