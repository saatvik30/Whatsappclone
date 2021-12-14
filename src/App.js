/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-gesture-handler';
import Signup from './screens/Signup';
import Login from './screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth'
import HomeScreen from './screens/HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ChatScreen from './screens/ChatScreen';
import firestore from '@react-native-firebase/firestore'
import AccountScreen from './screens/AccountScreen';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    
  },
};
const Stack = createStackNavigator();

const Navigation=()=> {
  const [user, setuser] = useState('')
  useEffect(() => {
    const unsubscribe=auth().onAuthStateChanged(userExist=>{
      if(userExist) {setuser(userExist)
      firestore().collection('users')
      .doc(userExist.uid)
      .update(
        {
          status:"online"
        }
      )  
    }
      else setuser('')
    })
    return () => {
      unsubscribe()
    }
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerTintColor:"green"
        }} >
        
        {user?
        <>
        <Stack.Screen name="Whatsapp"
        >
          {props=><HomeScreen {...props} user={user}/>}
           </Stack.Screen>
           <Stack.Screen name="chat" options={({ route }) => ({ title:<View><Text>{route.params.name}</Text><Text>{route.params.status}</Text></View> })}>
             {props=><ChatScreen {...props} user={user}/>}
           </Stack.Screen>
           <Stack.Screen name="account">
             {props=><AccountScreen {...props} user={user}/>}
           </Stack.Screen>
           </>
        :
        <>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
        </>
        }
          
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const App=()=>{
  return (<>
    <PaperProvider theme={theme}>
      <StatusBar barStyle='light-content' backgroundColor="green"/>
      <View style={styles.container}>
      <Navigation/>
      </View>
    </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"white",
  }
});

export default App;
