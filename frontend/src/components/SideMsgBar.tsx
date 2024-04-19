import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { chatstate } from "../store/atoms/Chat";
import { useFetchuser } from "../hooks/useFetchuser";
import { userState } from "../store/atoms/User";
import Logo from "../assets/Logo.png";
import { FiPlus } from "react-icons/fi";
import { FiAlignCenter, FiSearch } from "react-icons/fi";
import SideUserComp from "./SideUserComp";

type User = {
  username: string;
  name: string;
  profile: string;
};

const SideMsgBar = () => {
  const Chat = useRecoilValue(chatstate);
  const user = useRecoilValue(userState);
  const [Users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    console.log("Running");
    Chat.map(async (item) => {
      const id = item.touserID === user.id ? item.userID : item.touserID;
      console.log();
      const newuser = await useFetchuser(id);
      newuser.ChatId = item.id;
      const updatedarray = [newuser, ...Users];
      setUsers(updatedarray);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [Chat]);

  return (
    <div className="w-[25vw] h-screen p-4">
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
          <FiPlus className=" text-gray-500" />
          <FiAlignCenter className=" text-gray-500" />
        </div>
      </div>
      <hr className=" border-1 border-gray-500" />

      {/* SearchBar */}
      <div className="mt-[2vh] pl-2 py-2 rounded-md pr-[2vw] text-gray-400 bg-[#2B2D31] hidden md:flex gap-2 items-center">
        <FiSearch />
        <input
          type="text"
          placeholder="Search"
          className=" bg-[#2B2D31]  focus:outline-none text-gray-300"
          width={10}
        />
      </div>
      <div className="mt-[4vh]">
        {Users.map((item) => (
          <SideUserComp key={item.username} user={item} />
        ))}
      </div>
    </div>
  );
};

export default SideMsgBar;
