import React,{useState,useEffect} from 'react'
import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { FAB } from 'react-native-paper';
// import messaging from '@react-native-firebase/messaging';
export default function HomeScreen({user,navigation}) {
    const [users, setusers] = useState('')
    const getUsers=async()=>{
        const querySnap=await firestore().collection('users').where('uid','!=',user.uid).get()
        const alluser=querySnap.docs.map(docSnap=>docSnap.data())
        setusers(alluser)
    }

    useEffect(() => {
        getUsers()
    }, [])

    const RenderCard=({item})=>{
        return(
            <TouchableOpacity onPress={()=>{navigation.navigate('chat',{name:item.name,uid:item.uid,
            status:typeof(item.status)=="string"?item.status:item.status.toDate().toString()})}}>
            <View style={styles.card}>
                <Image source={{uri:item.pic}} style={styles.img}/>
                <Text style={styles.text}>{item.name}</Text>
             </View></TouchableOpacity>
        )
    }
    return (
        <View style={{flex:1}}>
            <FlatList data={users}
            renderItem={({item})=>{return <RenderCard item={item}/>}
    } keyExtractor={(item)=>item.uid}/>
        <FAB
        style={styles.fab}
        icon="face-profile"
        color="black"
        onPress={() => navigation.navigate("account")}
    />
        </View>
    )
}
const styles = StyleSheet.create({
   img:{
       width:60,height:60,borderRadius:30,backgroundColor:"green"
   },
   text:{
       fontSize:20,marginLeft:10
   },
   card:{flexDirection:"row",padding:7,
   backgroundColor:"white",borderBottomWidth:1,
   borderBottomColor:"grey"},
   fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:"white"
  }
  });