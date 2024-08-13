import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import { ChatDetails, chatstate, messageType, chatsType , GroupChatDetails } from "../store/atoms/Chat";
import { userState } from "../store/atoms/User";
import ChatScreenTopBar from "./ChatScreenTopBar";
import { fetchChat, fetchMsg } from "../pages/Chat";

type SendMsg = {
  token: string;
  type: string;
  message: string;
  chatId: string;
  fromId: string;
  toId: String;
};

type ChatScreenProps = {
  Socket: WebSocket;
};

const ChatScreen = ({ Socket }: ChatScreenProps) => {
  const [inputMsg, setInputMsg] = useState("");
  const user = useRecoilValue(userState);
  const [chatDetails, setChatDetails] = useRecoilState(ChatDetails);
  const [groupChatDetails , setGroupChatDetails] = useRecoilState(GroupChatDetails);
  const [chat, setChat] = useRecoilState(chatstate);

  const chatContainerRef = useRef<HTMLDivElement>(null); // Reference for the chat container

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;

    const msg: SendMsg = {
      token: localStorage.getItem("token") || "",
      type: "private",
      message: inputMsg,
      chatId: user.ChatId,
      fromId: user.id,
      toId: chatDetails?.userID as string,
    };

    const newMsg: messageType = {
      id: crypto.randomUUID(),
      message: msg.message,
      fromUser: msg.fromId,
      toUser: msg.toId,
      createdAt: new Date(),
    };

    // Update local state for chat details
    setChatDetails((prevDetails) => ({
      ...prevDetails!,
      send_message: [...(prevDetails?.send_message || []), newMsg],
    }));

    // Update the main chat list
    setChat((prevChat) =>
      prevChat.map((item) =>
        item.userID === newMsg.toUser
          ? { ...item, send_message: [...(item.send_message || []), newMsg] }
          : item
      )
    );

    Socket.send(JSON.stringify(msg));
    setInputMsg(""); // Clear input
  };

  const handleUpdateChatWithMessage = async (chatId: string) => {
    const updatedChat = await fetchChat();
    const chatWithMessages = updatedChat.map((item: chatsType) => {
      item.send_message = [];
      item.recived_message = [];
      return item;
    });

    const fetchedMessages = await fetchMsg();
    if (fetchedMessages) {
      fetchedMessages.forEach((msg: messageType) => {
        chatWithMessages.forEach((item: chatsType) => {
          if (msg.fromUser === item.userID && msg.toUser === user.id) {
            item.send_message.push(msg);
          } else if (msg.fromUser === user.id && msg.toUser === item.userID) {
            item.recived_message.push(msg);
          }
        });
      });
    }
    setChat(chatWithMessages);
  };

  useEffect(() => {
    Socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "private") {
        const newMsg: messageType = {
          id: data.id,
          message: data.message,
          fromUser: data.fromUser,
          toUser: data.toUser,
          createdAt: new Date(data.createdAt),
        };

        // If the message is from the current chat, update chatDetails
        if (chatDetails?.userID === data.fromUser) {
          setChatDetails((prevDetails: chatsType | null) => ({
            ...prevDetails!,
            recived_message: [...(prevDetails?.recived_message || []), newMsg],
          }));
        }

        // Update the chat list state
        setChat((prevChat) =>
          prevChat.map((item) =>
            item.userID === data.fromUser
              ? { ...item, send_message: [...(item.send_message || []), newMsg] }
              : item
          )
        );
      } else if (data.type === "chatId") {
        handleUpdateChatWithMessage(data.chatId);
      }
    };
  }, [Socket, chatDetails?.userID]);

  // Scroll to bottom when chatDetails are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatDetails]);

  return (
    <div className="w-full h-screen py-4 pl-2 pr-4 items-center justify-center">
      {!chatDetails ? (
        // 
        <div className="bg-[#222222] rounded-md w-full h-full flex flex-col gap-2" >
           <ChatScreenTopBar />
           <div className="justify-between mx-[3vw] pr-[2vw] pl-[1vw] rounded-md text-gray-400 bg-[#1A1A1A] hidden md:flex items-center">
            <div className="flex items-center gap-1">
              <FiPlusCircle />
              <input
                type="text"
                placeholder="Type your message..."
                className="bg-[#1A1A1A] p-[1.5vh] focus:outline-none text-sm text-gray-300 w-full"
                onChange={(e) => setInputMsg(e.target.value)}
                value={inputMsg}
              />
            </div>
            <FiSend
              className="text-[#5865F2] cursor-pointer"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#222222] rounded-md w-full h-full flex flex-col gap-2">
          <ChatScreenTopBar />
          <div
            ref={chatContainerRef} // Attach the reference
            className="w-full px-[5vw] flex overflow-y-scroll no-scrollbar flex-col h-[75vh] bg-[#222222] p-4"
          >
            {[...(chatDetails.send_message || []), ...(chatDetails.recived_message || [])]
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((item: messageType) => (
                <div
                  // key={item.id}
                  className={`${
                    item.fromUser === user.id
                      ? "self-end bg-green-600"
                      : "self-start bg-gray-700"
                  } text-white p-2 rounded-lg max-w-xs my-2`}
                >
                  <p>{item.message}</p>
                </div>
              ))}
          </div>

          <div className="justify-between mx-[3vw] pr-[2vw] pl-[1vw] rounded-md text-gray-400 bg-[#1A1A1A] hidden md:flex items-center">
            <div className="flex items-center gap-1">
              <FiPlusCircle />
              <input
                type="text"
                placeholder="Type your message..."
                className="bg-[#1A1A1A] p-[1.5vh] focus:outline-none text-sm text-gray-300 w-full"
                onChange={(e) => setInputMsg(e.target.value)}
                value={inputMsg}
              />
            </div>
            <FiSend
              className="text-[#5865F2] cursor-pointer"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
