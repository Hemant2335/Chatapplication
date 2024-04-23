import { useEffect } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilValue, useRecoilState } from "recoil";
import { messagestate } from "../store/atoms/Chat";
import { chatstate } from "../store/atoms/Chat";
import { create } from "domain";

export const useSocket = (url: string) => {
  const user = useRecoilValue(userState);
  const [Chat, setChat] = useRecoilState(chatstate);
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
        console.log("Got message:", data);
        if (data.ChatId) {
          // Find Chat and Add Message
          console.log("I am new Chat" ,data.newchat);
          if (data.newchat === false) {
            return setMsg((prevMsg) => [...prevMsg, data]);
          } else {
            // IF Chat not found then fetch the Chat
            console.log("I am Changing the Chat");
            const newchat = {
              id: data.ChatId,
              userID: data.fromUser,
              touserID: data.toUser,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            setChat((prevChat) => [...prevChat, newchat]);
            setMsg((prevMsg) => [...prevMsg, data]);
          }
        }
      };

      return () => {
        console.log("Cleaning up WebSocket");
        socket?.close();
      };
    }
  }, [url, user]);

  return { socket };
};
