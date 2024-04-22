import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { chatstate } from "../store/atoms/Chat";
import { useFetchuser } from "../hooks/useFetchuser";
import { userState } from "../store/atoms/User";
import Logo from "../assets/Logo.png";
import { FiPlus } from "react-icons/fi";
import { FiAlignCenter, FiSettings ,  FiSearch } from "react-icons/fi";
import SideUserComp from "./SideUserComp";
import { useNavigate } from "react-router-dom";

type User = {
  id : string;
  username: string;
  name: string;
  profile: string;
  ChatId : String;
};

const SideMsgBar = () => {
  const Chat = useRecoilValue(chatstate);
  const user = useRecoilValue(userState);
  const [Users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    if(Users.length <= 0 && Chat.length > 0)
    Chat.map(async (item) => {
      const id = item.touserID === user.id ? item.userID : item.touserID;
      if(id == null) return ;
      const newuser:User = await useFetchuser(id);
      if(newuser === null ) return ;
      console.log(item.id);
      newuser.ChatId = item.id;
      console.log("SideUser" , newuser);
      setUsers((prevMsg) => [...prevMsg, newuser]);
    });
  };

  useEffect(() => {
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
          <FiPlus className=" text-gray-500" onClick={()=>navigate("/Explore")}/>
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
      <div className="mt-[4vh] flex flex-col gap-3">
        {Users.map((item) => (
          <SideUserComp key={item.username} user={item} />
        ))}
      </div>
      <div className="absolute w-full bottom-[2vh] pr-[2vw]">
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
          <FiSettings className="text-gray-500"/>
        </div>
      </div>
    </div>
  );
};

export default SideMsgBar;
