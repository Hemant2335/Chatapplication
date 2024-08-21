import { useEffect } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { chatsType, groupChat, groupchatsType, grpmessageType, messageType } from "../store/atoms/Chat";
import { messagestate } from "../store/atoms/Chat";
import { chatstate } from "../store/atoms/Chat";
import SideMsgBar from "../components/SideMsgBar";
import ChatScreen from "../components/ChatScreen";
import { IsCreateGroupPopupAtom } from "../store/atoms/CompState";
import CreateGroup from "../components/Popups/CreateGroup";
import { IsAddUserGroupPopupAtom } from "../store/atoms/CompState";
import AddUserGroup from "../components/Popups/AddUserGroup";

export const fetchMsg = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/getmessages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") || "",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!data.Status) {
      alert(data.error);
      return;
    }
    console.log("Fetched new Messages", data.messages);
    return data.messages;
  } catch (error) {
    return console.log(error);
  }
};


export const fetchChat = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/getchats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") || "",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!data.Status) {
      alert(data.error);
    }
    console.log("Fetched new Chats", data.chats);
    return data.chats;
  } catch (error) {
    return console.log(error);
  }
};

const Chat = () => {
  const [chat, setchat] = useRecoilState(chatstate);
  const user = useRecoilValue(userState);
  const [GroupChat, setGroupChat] = useRecoilState(groupChat);
  
  const newsocket = new WebSocket("ws://ec2-13-60-193-223.eu-north-1.compute.amazonaws.com:8080");
  const [isCreateGroupPopup, setisCreateGroupPopup] = useRecoilState(
    IsCreateGroupPopupAtom
  );
  const IsAddUserGroupPopup = useRecoilValue(IsAddUserGroupPopupAtom);

  newsocket.onopen = () => {
    console.log("Connected to server");
    const userID = user.id;
    newsocket.send(JSON.stringify({ type: "createUser", id: userID }));
  };

  newsocket.onclose = () => {
    console.log("Disconnected from server");
  };

  // Handle the First refersh to get Message from the Server

  const handleUpdateChatwithMessage = async () => {
    const newchat = await fetchChat();
    const chat = newchat.map((item: chatsType) => {
      item.send_message = [];
      item.recived_message = [];
      return item;
    });
    const fetchmsg = await fetchMsg();
    if (fetchmsg) {
      fetchmsg.map((msg: messageType) => {
        chat.map((item: chatsType) => {
          if (msg.fromUser === item.userID && msg.toUser === user.id) {
            if (item.send_message === undefined) {
              item.send_message = [];
              item.send_message.push(msg);
            } else {
              item.send_message.push(msg);
            }
          } else if (msg.fromUser === user.id && msg.toUser === item.userID) {
            if (item.recived_message === undefined) {
              item.recived_message = [];
              item.recived_message.push(msg);
            } else {
              item.recived_message.push(msg);
            }
          }
        });
      });
    }
    setchat(chat);
    console.log("Updated Chat", chat);
  };

  useEffect(() => {
    handleUpdateChatwithMessage();
    
  }, []);

  return (
    <div className="w-full h-screen flex">
      <SideMsgBar />
      {isCreateGroupPopup && <CreateGroup Socket = {newsocket}/>}
      {IsAddUserGroupPopup && <AddUserGroup Socket = {newsocket}/>}
      <ChatScreen Socket={newsocket} />
    </div>
  );
};

export default Chat;
