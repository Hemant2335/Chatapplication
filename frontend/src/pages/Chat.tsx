import { useEffect, useState } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { messagestate } from "../store/atoms/Chat";
import { chatstate } from "../store/atoms/Chat";
import SideMsgBar from "../components/SideMsgBar";
import ChatScreen from "../components/ChatScreen";

const Chat = () => {
  const [user, setuser] = useRecoilState(userState);
  const [msg, setmsg] = useRecoilState(messagestate);
  const [chat , setchat] = useRecoilState(chatstate);
  const navigate = useNavigate();
  const [message, setmessage] = useState<string | null>(null);
  const { socket}  = useSocket(
    "ws://localhost:8080"
  );

  const fetchMsg = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/chat/getmessages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      setmsg(data.messages);
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchChat = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/chat/getchats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      console.log("Fetched new Chats" , data.chats);
      if(data.chats.length > chat.length)
        {
          setchat(data.chats);
        }
      
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      setuser(data.user);
    } catch (error) {
      return console.log(error);
    }
  };


  useEffect(() => {
    fetchChat();
  }, [chat]);

  useEffect(() => {
    fetchUser();
    fetchMsg();
    
  }, []);

  return (
    <div className="w-full h-screen flex">
      <SideMsgBar />
      <ChatScreen  Socket={socket}/> 
      {message}
    </div>
  );
};

export default Chat;
