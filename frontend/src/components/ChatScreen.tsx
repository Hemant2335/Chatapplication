import ChatScreenTopBar from "./ChatScreenTopBar";
import { ChatDetails } from "../store/atoms/Chat";
import { useRecoilValue, useRecoilState } from "recoil";
import { messagestate } from "../store/atoms/Chat";
import { useEffect, useState } from "react";
import { userState } from "../store/atoms/User";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import { useCookies } from "react-cookie";

type message = {
  id: String;
  message: String;
  createdAt: Date;
  fromUser: String;
  toUser: String;
  ChatId: String;
};

type chatmessage = {
  message: String;
  createdAt: Date;
};

type sendMsg = {
  token: String;
  type: String;
  message: String;
  Chatid: String;
  fromid: String;
  toid: String;
};

type ChatScreenProps = {
  Socket: WebSocket;
};

const ChatScreen = ({ Socket }: ChatScreenProps) => {
  const chatdetails: any = useRecoilValue(ChatDetails);
  const [messages, setmessages] = useRecoilState(messagestate);
  const user = useRecoilValue(userState);
  const [inputmsg, setinputmsg] = useState<string>("");
  const [Messages, setMessages] = useState<message[]>([]);
  const [fromMsg, setfromMsg] = useState<chatmessage[]>([]);
  const [toMsg, settoMsg] = useState<chatmessage[]>([]);
  const [SendMsg, setSendMsg] = useState<sendMsg>({
    token: "",
    type: "",
    message: "",
    Chatid: "",
    fromid: "",
    toid: "",
  });
  const [cookies] = useCookies(["token"]);

  //Finding the Messages of this Chat
  const findChatMessages = () => {
    const chatmessages = messages.filter(
      (item: any) => item.ChatId === chatdetails.ChatId
    );
    setMessages(chatmessages);
  };
  // Seprating the Messages
  const SeprateMsg = () => {
    const frommsg = Messages.filter((item) => item.fromUser === user.id);
    const tomsg = Messages.filter((item) => item.fromUser === chatdetails.id);
    setfromMsg(frommsg);
    settoMsg(tomsg);
  };
  // Sending the Message
  const handleSendMessage = () => {
    console.log("Sending Message");
    console.log(chatdetails);
    SendMsg.message = inputmsg;
    if (SendMsg.toid.length > 0) {
      Socket.send(JSON.stringify(SendMsg));
      setinputmsg("");
      const data: message = {
        id: "1",
        ChatId: SendMsg.Chatid,
        fromUser: SendMsg.fromid,
        toUser: SendMsg.toid,
        message: SendMsg.message,
        createdAt: new Date(),
      };
      setmessages([...messages, data]);
    } else {
      alert("Please Wait");
    }
  };
  // useEffects
  useEffect(() => {
    SeprateMsg();
  }, [Messages]);

  useEffect(() => {
    console.log("Mesasges updated");
    if (chatdetails) {
      SendMsg.token = cookies.token;
      SendMsg.type = "message";
      SendMsg.message = "Hello";
      SendMsg.Chatid = chatdetails.ChatId;
      SendMsg.fromid = user.id;
      SendMsg.toid = chatdetails.id;
      setSendMsg(SendMsg);
    }
    findChatMessages();
  }, [messages, chatdetails]);

  return (
    <div className="w-full h-screen py-4 pl-2  pr-4 items-center justify-center ">
      <div className="bg-[#222222] rounded-md w-full h-full flex flex-col gap-2">
        <ChatScreenTopBar />
        <div className="w-full flex overflow-y-scroll no-scrollbar justify-between h-[75vh] bg-[#222222] ">
          {/* //Sent Messages */}
          <div>
            {fromMsg.map((item: any) => (
              <div
                key={item.id}
                className="bg-[#2B2D31] w-[80%] rounded-md p-2 my-2 ml-auto"
              >
                <p className="text-white">{item.message}</p>
              </div>
            ))}
          </div>

          {/* Recieved Messages */}
          <div>
            {toMsg.map((item: any) => (
              <div
                key={item.id}
                className="bg-[#2B2D31] w-[80%] rounded-md p-2 my-2"
              >
                <p className="text-white">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="justify-between mx-[3vw] pr-[2vw] pl-[1vw]  rounded-md  text-gray-400 bg-[#1A1A1A] hidden md:flex  items-center">
          <div className="flex items-center gap-1">
            <FiPlusCircle />
            <input
              type="text"
              placeholder="type your message..."
              className=" bg-[#1A1A1A] p-[1.5vh] focus:outline-none text-sm text-gray-300 w-full"
              onChange={(e) => setinputmsg(e.target.value)}
              value={inputmsg}
            />
          </div>
          <FiSend
            className="text-[#5865F2] cursor-pointer"
            onClick={() => handleSendMessage()}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
