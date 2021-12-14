import React,{useState,useEffect} from 'react'
import { View, Text,Image,StyleSheet,TouchableOpacity ,ActivityIndicator} from 'react-native'
import {TextInput,Button } from 'react-native-paper'
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
// import messaging from '@react-native-firebase/messaging';

export default function Signup({navigation}) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null)
    const [next, setNext] = useState(false)
    const [loading, setloading] = useState(false)
    const [token, settoken] = useState('')
    // useEffect(() => {
    //     messaging().getToken().then(token=>settoken(token))
    // }, [])
    if(loading){
        return<ActivityIndicator size="large" color="#00ff00" />
    }
    const usersignup=async()=>{
        
        setloading(true)
        if(!email||!password||!image||!name){
            alert("please fill all the fileds")
            return
        }try{
        const result =await auth().createUserWithEmailAndPassword(email,password)
        firestore().collection('users').doc(result.user.uid).set({
            name:name,
            email:result.user.email,
            pic:image,
            uid:result.user.uid,
            status:"online",
            token:token
        })
        
        setloading(false)
    }
    
    catch(err){
        alert(err)
    }
    }
    const pickImageAndUpload = ()=>{
        launchImageLibrary({quality:0.5},(fileobj)=>{
            console.log(fileobj.assets[0].uri)
            if(fileobj.didCancel){
                alert("please select a photo")
                return
            }
         const uploadTask =  storage().ref().child(`/userprofile/${Date.now()}`).putFile(fileobj.assets[0].uri)
                uploadTask.on('state_changed', 
                 (snapshot) => {
    
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress==100) alert('image uploaded')
                    
                }, 
                (error) => {
                    alert(error)
                }, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setImage(downloadURL)
                    });
                }
                );
        })
    }
    
    return (<>
        <View style={styles.box1}>
            <Text style={styles.text}>Welcome to whatsapp</Text>
            <Image style={styles.img}
        source={require('../assets/image.png')}/>
        </View>
        
        <View style={styles.box2}>
            {!next && 
            <>
            <TextInput label="email"
            value={email}
            onChangeText={(text)=>{setEmail(text)}}
            mode="outlined"/>
            <TextInput label="password"
            value={password}
            onChangeText={(text)=>{setPassword(text)}}
            secureTextEntry={true}
            mode="outlined"/>
            </>
                }
                {next?
                <>
                     <TextInput label="Name"
                     value={name}
                     onChangeText={(text)=>{setName(text)}}
                     mode="outlined"/>
                     <Button mode="contained" 
                     onPress={()=>pickImageAndUpload()}>Upload profile picture</Button>
                     <Button mode="contained" 
                     onPress={()=>usersignup()}
                     disabled={image?false:true}>Signup</Button>
                     </>
                    :
                    <Button mode="contained" 
                     onPress={()=>setNext(true)} disabled={!(email&&password)}>Next</Button>
                }
            <TouchableOpacity style={styles.box1} onPress={()=>navigation.navigate('Login')}>
                         <Text>Already have an account? Login</Text>
                         </TouchableOpacity>
                     
           
        </View>
        </>
    )
}
const styles = StyleSheet.create({
    text:{
      fontSize:22,
      color:"green",
      margin:10,
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
    }
  });
  