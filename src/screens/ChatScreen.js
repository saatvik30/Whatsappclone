import React, { useState, useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { LogBox } from "react-native";
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(["ReactNativeFirebaseMessagingHeadlessTask"]);
export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState('')
  const [pro, setPro] = useState('')
  const { uid } = route.params;

  const getAllMessages = async () => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    const querySanp = await firestore().collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', "desc")
      .get()
    const allmsg = querySanp.docs.map(docSanp => {
      const data = docSanp.data()
      return {
        ...docSanp.data(),
        createdAt: docSanp.data().createdAt.toDate()
      }
    })
    setMessages(allmsg)


  }
  const getData=()=>{
    firestore().collection('users').doc(uid).get().then(docSnap => {
      setProfile(docSnap.data())
    })
    firestore().collection('users').doc(user.uid).get().then(docSnap => {
      setPro(docSnap.data())})
  }
  useEffect(() => {
        getData()
      const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
      const messageRef = firestore().collection('chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt', "desc")

      const unSubscribe = messageRef.onSnapshot((querySnap) => {

        const allmsg = querySnap.docs.map(docSanp => {
          const data = docSanp.data()
          if (data.createdAt) {
            return {
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate()
            }
          } else {
            return {
              ...docSanp.data(),
              createdAt: new Date()
            }
          }

        })
        setMessages(allmsg)
      })
      
      return () => {
        unSubscribe()
      }
    }, [])
    const onSend = (messageArray) => {
      const msg = messageArray[0]
      const mymsg = {
        ...msg,
        sentBy: user.uid,
        sentTo: uid,
        createdAt: new Date(),

      }
      // fetch('http://3b7c-2409-4043-2205-9f18-34c4-9cd0-7f81-c289.ngrok.io/send-noti',{
      //   method:'post',
      //   headers: {
      //     'Content-Type': 'application/json'

      //   },
      //   body:JSON.stringify({token:profile.token,
      //   name:pro.name,
      //   message:msg.text})
      // })
      setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
      const docid = uid > user.uid + uid ? user.uid + "-" + uid : uid + "-" + user.uid
      firestore().collection('chatrooms')
        .doc(docid)
        .collection('messages')
        .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <GiftedChat
          messages={messages}
          onSend={text => onSend(text)}
          user={{
            _id: user.uid,
          }}
          renderBubble={(props) => {
            return <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "green"
                }
              }}
            />
          }}
          renderInputToolbar={(props) => {
            return <InputToolbar {...props}
              containerStyle={{ borderTopWidth: 1.5, borderTopColor: 'green' }} />
          }}
        />
      </View>
    )
  }
