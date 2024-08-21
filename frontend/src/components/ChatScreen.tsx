import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import {
  ChatDetails,
  chatstate,
  messageType,
  chatsType,
  GroupChatDetails,
  groupChat,
  grpmessageType,
} from "../store/atoms/Chat";
import { userState } from "../store/atoms/User";
import ChatScreenTopBar from "./ChatScreenTopBar";
import { fetchChat, fetchMsg } from "../pages/Chat";
import { v4 as uuidv4 } from 'uuid';

type SendMsg = {
  token: string;
  type: string;
  message: string;
  chatId: string;
  fromId: string;
  toId: string;
};

type ChatScreenProps = {
  Socket: WebSocket;
};

const ChatScreen = ({ Socket }: ChatScreenProps) => {
  const [inputMsg, setInputMsg] = useState("");
  const user = useRecoilValue(userState);
  const [chatDetails, setChatDetails] = useRecoilState(ChatDetails);
  const [groupChatDetails, setGroupChatDetails] =
    useRecoilState(GroupChatDetails);
  const [GroupChat, setGroupChat] = useRecoilState(groupChat);
  const [chat, setChat] = useRecoilState(chatstate);

  const chatContainerRef = useRef<HTMLDivElement>(null); // Reference for the chat container


  function generateUUID() {
    return uuidv4();
  }
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
      id: generateUUID(),
      message: msg.message,
      fromUser: msg.fromId,
      toUser: msg.toId,
      createdAt: new Date(),
      isRead : false
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

  const handleSendGroupMessage = () => {
    if (!inputMsg.trim()) return;

    const msg = {
      token: localStorage.getItem("token") || "",
      fromId: user.id,
      groupId: groupChatDetails?.id,
      content: inputMsg,
      type: "group",
    };

    const newMsg: grpmessageType = {
      id: crypto.randomUUID(),
      message: msg.content,
      fromUser: msg.fromId,
      createdAt: new Date(),
      GroupChatId: msg.groupId as string,
    };

    // Update local state for group chat details
    setGroupChatDetails((prevDetails) => ({
      ...prevDetails!,
      group_message: [...(prevDetails?.group_message || []), newMsg],
    }));

    // Update the main group chat list
    setGroupChat((prevGroupChat) =>
      prevGroupChat.map((item) =>
        item.id === msg.groupId
          ? {
              ...item,
              group_message: [...(item.group_message || []), newMsg],
            }
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
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);
  
  const showNotification = (title:any, body:any) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };


  useEffect(() => {
    Socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);

      if (data.type === "private") {
        const newMsg: messageType = {
          id: data.id,
          message: data.message,
          fromUser: data.fromUser,
          toUser: data.toUser,
          createdAt: new Date(data.createdAt),
          isRead : false
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
              ? {
                  ...item,
                  send_message: [...(item.send_message || []), newMsg],
                }
              : item
          )
        );
        if (data.fromUser !== user.id) {
          showNotification("New Message", newMsg.message);
        }


      } else if (data.type === "chatId") {
        handleUpdateChatWithMessage(data.chatId);
      } else if (data.type === "group") {
        const newMsg: grpmessageType = {
          id: data.id,
          message: data.content,
          fromUser: data.from,
          createdAt: new Date(data.createdAt),
          GroupChatId: data.groupId,
        };

        // Update group chat details if the message belongs to the current group
        if (groupChatDetails?.id === data.groupId) {
          setGroupChatDetails((prevDetails) => ({
            ...prevDetails!,
            group_message: [...(prevDetails?.group_message || []), newMsg],
          }));
        }

        // Update the main group chat list
        setGroupChat((prevGroupChat) =>
          prevGroupChat.map((item) =>
            item.id === data.groupId
              ? {
                  ...item,
                  group_message: [...(item.group_message || []), newMsg],
                }
              : item
          )
        );

        if (data.fromUser !== user.id) {
          showNotification("New Message", newMsg.message);
        }
      } else if (data.type === "creategroup") {
        console.log("New Group", data);
        const newGroup = data.group;
        // Check if the group already exists
        const existingGroup = GroupChat.find((item) => item.id === newGroup.id);
        if (!existingGroup) {
          const newGrpchat = [...GroupChat, newGroup];
          setGroupChat(newGrpchat);
        }
      }
    };
  }, [Socket, chatDetails?.userID, groupChatDetails?.id]);

  // Scroll to bottom when chatDetails or groupChatDetails are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatDetails, groupChatDetails]);

  return (
    <div className="w-full h-screen py-4 pl-2 pr-4 items-center justify-center">
      {!chatDetails ? (
        <div className="bg-[#222222] rounded-md w-full h-full flex flex-col gap-2">
          <ChatScreenTopBar />

          {/* Messages of Group */}
          <div
            className="w-full px-[5vw] flex overflow-y-scroll no-scrollbar flex-col h-[75vh] bg-[#222222] p-4"
            ref={chatContainerRef}
          >
            {groupChatDetails?.group_message.map((item: grpmessageType) => (
              <div
                // key={item.id}
                className={`${
                  item.fromUser === user.id
                    ? "self-end bg-[#1a1a1a]"
                    : "self-start bg-gray-800"
                } text-white p-2 rounded-lg max-w-xs my-2`}
              >
                <div>
                  <h1 className="text-red-400">
                    {groupChatDetails.users.map((Otheruser: any) => {
                      if (Otheruser.id === item.fromUser) {
                        if (Otheruser.id === user.id) return "You";
                        return Otheruser.username;
                      }
                      return null;
                    })}
                  </h1>
                  <p>{item.message}</p>
                </div>
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
              onClick={handleSendGroupMessage}
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
            {[
              ...(chatDetails.send_message || []),
              ...(chatDetails.recived_message || []),
            ]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
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
