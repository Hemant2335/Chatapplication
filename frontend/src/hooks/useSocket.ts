import { useEffect } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilValue, useRecoilState } from "recoil";
import { messagestate } from "../store/atoms/Chat";

export const useSocket = (url: string) => {
  const user = useRecoilValue(userState);
  const [msg, setMsg] = useRecoilState(messagestate);
  let socket: WebSocket | null = new WebSocket(url);

  useEffect(() => {
    if (user.id) {
      console.log("User ID exists, connecting WebSocket");
      socket.onopen = () => {
        console.log("Connected to WebSocket");
        const message = JSON.stringify({
          type: "user",
          id: user.id,
        });
        socket?.send(message);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        if(data.ChatId){
        setMsg((prevMsg) => [...prevMsg, data]);
        }
      };

      return () => {
        console.log("Cleaning up WebSocket");
        socket?.close();
      };
    }
  }, [url, user.id]);

  return { socket };
};
