import { useEffect, useState } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const Chat = () => {
  const [user, setuser] = useRecoilState(userState);
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
  }, []);

  



  return <div>{`${user?.name} : ${message}`}</div>;
};

export default Chat;
