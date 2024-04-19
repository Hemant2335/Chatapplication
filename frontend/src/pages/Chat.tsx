import { useEffect, useState } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { messagestate } from "../store/atoms/Chat";
import { chatstate } from "../store/atoms/Chat";
import SideMsgBar from "../components/SideMsgBar";

const Chat = () => {
  const [user, setuser] = useRecoilState(userState);
  const setmsg = useSetRecoilState(messagestate);
  const setchat = useSetRecoilState(chatstate);
  const navigate = useNavigate();
  const [message, setmessage] = useState<string | null>(null);
  const { socket, connect, disconnect } = useSocket(
    "ws://localhost:8080",
    user
  );

  useEffect(() => {
    if (!user.id) return;
    connect();
    socket.onmessage = (event) => {
      setmessage(event.data);
    };
    return () => {
      disconnect();
    };
  }, [user]);

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
      console.log(data);
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      setmsg(data.messages);
    } catch (error) {
      return console.log(error);
    }
  }

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
      console.log(data);
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      setchat(data.chats);
    } catch (error) {
      return console.log(error);
    }
  }



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
      console.log(data);
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
    fetchUser();
    fetchMsg();
    fetchChat();
  }, []);





  return <div>
    <SideMsgBar/>
  </div>;
};

export default Chat;
