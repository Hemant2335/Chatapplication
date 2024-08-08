import { atom } from "recoil";

export type messageType = {
    id    :    String ,
  message :  String,
  createdAt :  Date,
  fromUser :  String,
  toUser   :  String ,
}

export type chatsType  = {
    id? : String, // ChatId
    userID : String,  // 
    createdAt : Date,
    updatedAt : Date,  
    recived_message : messageType[],
    send_message : messageType[],
    name : String,
    username : String,
    profile : String,
}

export const messagestate = atom({
    key : "message",
    default : [] as messageType[]
})

export const chatstate  = atom({
    key : "chats",
    default : [] as chatsType[]
})

export const ChatDetails = atom({
    key : "chatdetails",
    default : {} as chatsType
})
