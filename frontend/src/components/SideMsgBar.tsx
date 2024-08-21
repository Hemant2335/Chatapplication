import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { chatstate, groupchatsType, grpmessageType } from "../store/atoms/Chat";
import { useFetchuser } from "../hooks/useFetchuser";
import { userState } from "../store/atoms/User";
import Logo from "../assets/Logo.png";
import { FiPlus } from "react-icons/fi";
import { FiAlignCenter, FiSettings, FiSearch } from "react-icons/fi";
import SideUserComp from "./SideUserComp";
import { groupChat } from "../store/atoms/Chat";
import { IsCreateGroupPopupAtom } from "../store/atoms/CompState";
import SideGroupComp from "./SideGroupComp";

type User = {
  id: string;
  username: string;
  name: string;
  profile: string;
  ChatId: String;
};

export const fetchGroupMsg = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/getgroupmessages`,
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
    console.log("Fetched new Group Messages", data.messages);
    return data.messages;
  } catch (error) {
    return console.log(error);
  }
};

const SideMsgBar = () => {
  const Chat = useRecoilValue(chatstate);
  const user = useRecoilValue(userState);
  const [IsUserChats, setIsUserChats] = useState(false);
  const [Users, setUsers] = useState<User[]>([]);
  const [GroupChat, setGroupChat] = useRecoilState(groupChat);
  const SetIsCreateGroupPopup = useSetRecoilState(IsCreateGroupPopupAtom);

  const fetchUsers = async () => {
    if (Chat.length === 0) return;
    console.log("fetch Chat", Chat);
    const promises = Chat.map(async (item) => {
      const id = item.userID === user.id ? item.userID : item.userID;
      if (id == null) return null;
      return useFetchuser(id);
    });
    const fetchedUsers = await Promise.all(promises);
    const filteredUsers = fetchedUsers.filter((user) => user !== null);
    const updatedUsers = filteredUsers.map((user) => ({
      ...user,
      ChatId: Chat.find(
        (chat) => chat.userID === user.id || chat.userID === user.id
      )?.id,
    }));
    console.log(updatedUsers);
    setUsers(updatedUsers);
  };

  const fetchGroup = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/getgroup`,
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

      console.log("Fetched new Group", data);
      let chat = data.groups;
      console.log("Group Chat", chat);
      const newGrpchat = chat.map((item: groupchatsType) => {
        const newItem = { ...item };
        newItem.group_message = [];
        return newItem;
      });
      const fetchmsg = await fetchGroupMsg();
      console.log(fetchmsg, "nk messge", newGrpchat);
      if (fetchmsg) {
        fetchmsg.map((msg: any) => {
          newGrpchat.map((item: groupchatsType) => {
            if (msg.GroupChatId === item.id) {
              if (item.group_message === undefined) {
                item.group_message = [];
                item.group_message.push(msg);
              } else {
                item.group_message.push(msg);
              }
            }
          });
        });
      }
      setGroupChat(newGrpchat);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  useEffect(() => {
    console.log("Side Chat", Chat);
    fetchUsers();
  }, [Chat]);

  return (
    <div className="w-[25vw] h-screen p-4 relative">
      <div className="flex items-center justify-between cursor-pointer overflow-hidden  pt-2  text-[3vh] font-bold ">
        <div className="flex items-center ">
          <img
            src={Logo}
            className="rounded-xl max-h-[10vh] md:max-h-[9vh] object-cover"
            alt="logo"
          />
          <div className="">
            <h1 className="text-[2.5vh]">OneChat</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiPlus
            className=" text-gray-500"
            onClick={() => SetIsCreateGroupPopup(true)}
          />
          <FiAlignCenter className=" text-gray-500" />
        </div>
      </div>
      <hr className=" border-1 border-gray-500" />

      {/* SearchBar */}
      <div className="mt-[2vh] pl-2 py-2 rounded-md pr-[2vw] text-gray-400 bg-[#222222] hidden md:flex gap-2 items-center">
        <FiSearch />
        <input
          type="text"
          placeholder="Search"
          className=" bg-[#222222]  focus:outline-none text-gray-300"
          width={10}
        />
      </div>
      <div className="w-full h-[5vh] flex justify-between items-center px-4 mt-[2vh]">
        <div
          onClick={() => {
            setIsUserChats(true);
          }}
          className="bg-[#222222] w-full cursor-pointer mx-2 py-3 px-2 font-bold text-sm rounded-md shadow-2xl"
        >
          Chat
        </div>
        <div
          onClick={() => {
            setIsUserChats(false);
          }}
          className="bg-[#222222] cursor-pointer w-full mx-2 py-3 px-2 font-bold  text-sm rounded-md shadow-2xl"
        >
          Group Chat
        </div>
      </div>
      {IsUserChats ? (
        <div className="mt-[4vh] flex flex-col gap-3 overflow-y-scroll h-[65vh]">
          {Users.map((item) => (
            <SideUserComp key={item.username} user={item} />
          ))}
        </div>
      ) : (
        <div className="mt-[4vh] flex flex-col gap-3 overflow-y-scroll h-[65vh]">
          {GroupChat?.map((item) => (
            <SideGroupComp key={item.id} group={item} />
          ))}
        </div>
      )}

      <div className="absolute w-full bottom-[2vh] bg-[#222222] pr-[2vw]">
        <hr className=" border-1 border-gray-500 " />
        <div className="flex items-center rounded-lg justify-between  p-3">
          <div className="flex gap-2 items-center">
            <img
              src={user.profile}
              className="rounded-[50%] max-h-[10vh] md:max-h-[5vh] object-cover"
              alt="logo"
            />
            <div className="">
              <h1 className="text-[2vh] font-bold">{user.name}</h1>
              <p className="text-[1.7vh] font-medium text-gray-500">
                @{user.username}
              </p>
            </div>
          </div>
          <FiSettings className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SideMsgBar;
