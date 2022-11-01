import FriendScreen from './screens/Friends';
import PlateLookupScreen from './screens/PlateLookup';
import ProfileScreen from './screens/Profile';
import SignUpScreen from './screens/SignUp';
import SignInScreen from './screens/SignIn';
import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const BaseStack = createNativeStackNavigator();


const PlateLookupStack = createNativeStackNavigator();

function PlateLookupStackScreen() {
  return (
    <PlateLookupStack.Navigator>
      <PlateLookupStack.Screen name="Plate Lookup" component={PlateLookupScreen} options={{
        title: 'Plate Lookup',
        headerShown: true,
      }}/>
      <PlateLookupStack.Screen name="Profile" component={ProfileScreen} />
    </PlateLookupStack.Navigator>
  );
}

const FriendsStack = createNativeStackNavigator();

function FriendsStackScreen() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen name="Friends" component={FriendScreen} options={{
        title: 'Friends',
        headerShown: true,
      }}/>
      <FriendsStack.Screen name="Profile" component={ProfileScreen}/>
    </FriendsStack.Navigator>
  )
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen}/>
    </ProfileStack.Navigator>
  )
}

function MyTabs( {navigation} ) {

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen (disabled for ease of troubleshooting)
        // e.preventDefault();
      }),
    [navigation]
  );

  return (
    <Tab.Navigator>
      <Tab.Screen name="PlateLookupTab" component={PlateLookupStackScreen} options={{
        headerShown: false,
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
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{
        headerShown: false,
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
      <Tab.Screen name="FriendsTab" component={FriendsStackScreen} options={{
        headerShown: false,
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
      <BaseStack.Navigator>
        <BaseStack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{
            title: "Sign In",
            headerShown: true
          }}
        />
        <BaseStack.Screen
          name="Sign Up"
          component={SignUpScreen}
          options={{
            title: "Sign Up",
            headerShown: true
          }}
        />
        <BaseStack.Screen name="TabPages" component={MyTabs} options={{headerShown: false}}/>
      </BaseStack.Navigator>
    </NavigationContainer>
  );
}

