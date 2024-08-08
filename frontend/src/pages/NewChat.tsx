import React from "react";
import { userState } from "../store/atoms/User";
import { useRecoilValue } from "recoil";

const NewChat = () => {
  const newsocket = new WebSocket("ws://localhost:8080");
  const user = useRecoilValue(userState);

  newsocket.onopen = () => {
    console.log("Connected to server");
    const userID = user.id;
    newsocket.send(JSON.stringify({ type: "createUser", id: userID }));
  };

  newsocket.onmessage = (msg) => {
    console.log("Message from server", msg.data);
  };

  newsocket.onclose = () => {
    console.log("Disconnected from server");
  };

  const handleSend = () => {
    const targetId = user.id;
    const message = {
      type: "private",
      content: "Hello from client",
      targetId,
    };
    newsocket.send(JSON.stringify(message));
  };

  return (
    <>
      <div style={{ gap: "2vw", display: "flex" }}>
        <input type="text" />
        <button>Send</button>
      </div>
    </>
  );
};

export default NewChat;
