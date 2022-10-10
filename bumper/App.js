import FriendScreen from './screens/Friends';
import PlateLookupScreen from './screens/PlateLookup';
import Profile from './screens/Profile';
import SignUpScreen from './screens/SignUp';
import SignInScreen from './screens/SignIn';
import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Plate Lookup" component={PlateLookupScreen} options={{
        title: 'Plate Lookup',
        headerShown: true,
        tabBarLabel:() => {return null},
        tabBarIcon: ({ focused }) => {
          const image = focused
          ? require('./assets/plate_filled.png')
          : require('./assets/plate.png')
          
          return (
              <Image
                  source={image}
                  style={{height:38, width:38}}
              />
          )
        }
      }}/>
      <Tab.Screen name="Profile" component={Profile} options={{
        title: 'Profile',
        headerShown: true,
        tabBarLabel:() => {return null},
        tabBarIcon: ({ focused }) => {
          const image = focused
          ? require('./assets/user_filled.png')
          : require('./assets/user.png')
          
          return (
              <Image
                  source={image}
                  style={{height:38, width:38}}
              />
          )
        }
      }}/>
      <Tab.Screen name="Friends" component={FriendScreen} options={{
        title: 'Friends',
        headerShown: true,
        tabBarLabel:() => {return null},
        tabBarIcon: ({ focused }) => {
          const image = focused
          ? require('./assets/people_filled.png')
          : require('./assets/people.png')
          
          return (
              <Image
                  source={image}
                  style={{height:38, width:38}}
              />
          )
        }
      }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{
            title: "Sign In",
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUpScreen}
          options={{
            title: "Sign Up",
            headerShown: true
          }}
        />
        <Stack.Screen name="TabPages" component={MyTabs} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

