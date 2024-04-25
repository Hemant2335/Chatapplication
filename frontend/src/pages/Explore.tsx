import { useEffect, useState } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import SideUserComp from "../components/SideUserComp";
import { useRecoilValue } from "recoil";
import { chatstate } from "../store/atoms/Chat";

const Explore = () => {
  const [inputmsg, setinputmsg] = useState("");
  const [Users, setUsers] = useState<any>([]);
  const [SearchUser, setSearchUser] = useState<{} | null>(null);
  const Chat = useRecoilValue(chatstate);

  const handleSearch = async () => {
    // Fetch Searched User
    if (!inputmsg) return setSearchUser(null);
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/SearchUser?username=${inputmsg}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("token") || "",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    const user = data.user;
    Chat.map(async (item) => {
      const id = item.touserID === user.id || item.userID === user.id;
      if (id) {
        user.ChatId = item.id;
      }
    });
    console.log("Explore User", user);
    setSearchUser(user);
  };

  const RecommendedUsers = async () => {
    // Fetch Recommended Users
    if(!(Chat.length > 0)) return ;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/alluser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token") || "",
      },
      credentials: "include",
    });
    const data = await res.json();
    const users = data.users;
    users?.map((user: any) => {
      Chat.map((item) => {
        const id = item.touserID === user.id || item.userID === user.id;
        if (id) {
          user.ChatId = item.id;
          console.log(user);
        }
      });
    });
    setUsers(users);
    console.log("Explore Users", users);
    //
  };


  useEffect(() => {
    console.log(Chat);
    RecommendedUsers();
  }, [Chat]);

  return (
    <div className="p-4  w-full h-screen flex flex-col items-center">
      <div className="justify-between mx-[3vw] pr-[2vw] mt-[3vh] pl-[1vw]  rounded-md  text-gray-400 bg-[#222222] hidden md:flex  items-center">
        <div className="flex items-center gap-1">
          <FiSearch />
          <input
            type="text"
            placeholder="Search Username..."
            className=" bg-[#222222] p-[1.5vh] focus:outline-none text-sm text-gray-300 w-[50vw]"
            onChange={(e) => setinputmsg(e.target.value)}
            value={inputmsg}
          />
        </div>
        <FiSend
          className="text-[#5865F2] cursor-pointer"
          onClick={() => handleSearch()}
        />
      </div>
      <div className="flex flex-start mt-[7vh] w-[70vw]">
        <h1 className="text-left text-[3.5vh] font-bold">Other Users</h1>
      </div>
      <div className="mt-[3vh]  grid grid-cols-5 gap-2 ">
        {/* Display Users */}
        {!SearchUser &&
          Users?.map((user: any) => (
            <SideUserComp key={user.username} user={user} />
          ))}
        {SearchUser && (
          <SideUserComp key={(SearchUser as any).username} user={SearchUser} />
        )}
      </div>
    </div>
  );
};

export default Explore;
