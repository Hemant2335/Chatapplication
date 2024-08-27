import { atom } from "recoil";

export type messageType = {
    id    :    String ,
  message :  String,
  createdAt :  Date,
  fromUser :  String,
  toUser   :  String ,
  Status : String
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

export type grpmessageType = {
    id : String,
    message : String,
    createdAt : Date,
    GroupChatId: String,
    fromUser : String,
}


export type groupchatsType = {
    id : String,
    createdAt : Date,
    updatedAt : Date,
    group_message : grpmessageType[],
    name : String,
    profile : String,
    users : String[],
}

export const groupChat = atom({
    key : "groupChat",
    default : [] as groupchatsType[]
})

export const messagestate = atom({
    key : "message",
    default : [] as messageType[]
})

export const chatstate  = atom({
    key : "chats",
    default : [] as chatsType[]
})

export const ChatDetails = atom<chatsType | null>({
    key : "chatdetails",
    default : {} as chatsType
})

export const GroupChatDetails = atom<groupchatsType | null>({
    key : "groupchatdetails",
    default : {} as groupchatsType
})
