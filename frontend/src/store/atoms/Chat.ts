import { atom } from "recoil";

type message = {
    id    :    String ,
  message :  String,
  createdAt :  Date,
  fromUser :  String,
  toUser   :  String ,
  ChatId   :  String,
}

type chats  = {
    id : String,
    userID : String,
    touserID : String,
    createdAt : Date,
    updatedAt : Date,  
}

export const messagestate = atom({
    key : "message",
    default : [] as message[]
})

export const chatstate  = atom({
    key : "chats",
    default : [] as chats[]

})