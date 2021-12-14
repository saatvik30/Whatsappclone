import React,{useState} from 'react'
import { View, Text ,StyleSheet,Image,TouchableOpacity,ActivityIndicator} from 'react-native'
import {TextInput,Button} from 'react-native-paper'
import auth from '@react-native-firebase/auth'
export default function Login({navigation}) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null)
    const [next, setNext] = useState(false)
    const [loading, setloading] = useState(false)
    if(loading){
        return<ActivityIndicator size="large" color="#00ff00" />
    }
    const userLogin=async()=>{
        setloading(true)
        if(!email||!password){
            alert("please fill both email and password")
            return
        }try{
        const result =await auth().signInWithEmailAndPassword(email,password)
        setloading(false)
    }
    
    catch(err){
        alert("something wrong")
    }
    }
    return (<>
        <View style={styles.box1}>
            <Text style={styles.text}>Welcome to whatsapp</Text>
            <Image style={styles.img}
        source={require('../assets/image.png')}/>
        </View>
        <View style={styles.box2}>
            <TextInput label="email"
            value={email}
            onChangeText={(text)=>{setEmail(text)}}
            mode="outlined"/>
             <TextInput label="password"
            value={password}
            onChangeText={(text)=>{setPassword(text)}}
            secureTextEntry={true}
            mode="outlined"/>
             <Button mode="contained" 
                     onPress={()=>userLogin()}>Login</Button>
                     <TouchableOpacity style={styles.box1} onPress={()=>navigation.navigate('Signup')}>
                         <Text style={styles.txt2}>dont have an account?click here</Text>
                         </TouchableOpacity>
                     
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    text:{
      fontSize:22,
      color:"green",
      margin:10
    },
    img:{
        width:200,
        height:200
    },
    box1:{
        alignItems:'center',
    },
    box2:{
        paddingHorizontal:40,
        justifyContent:"space-evenly",
        height:'50%'
    },
    txt2:{
        color:"green"
    }
  });