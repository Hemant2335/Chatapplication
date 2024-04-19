import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { chatstate } from "../store/atoms/Chat";
import { useFetchuser } from "../hooks/useFetchuser";
import { userState } from "../store/atoms/User";

type User = {
    username: string,
    name: string,
    profile: string,
}


const SideMsgBar = () => {
  const Chat = useRecoilValue(chatstate);
  const user = useRecoilValue(userState);
  const [Users , setUsers] = useState<User[]>([]);

  const fetchUsers = async () =>{
    console.log("Running");
    Chat.map(async(item)=>{
        const id = (item.touserID === user.id) ? item.userID : item.touserID;
        console.log()
        const newuser = await useFetchuser(id);
        const updatedarray = [newuser , ...Users];
        setUsers(updatedarray);
    })
  }

  useEffect(()=>{
    fetchUsers();
  },[Chat])

  return (
    <div className="max-w-[22vw] h-screen">
      {/* {Users.map((item)=>(
        <h1 key={item.username}>{item.username}</h1>
      ))} */}
      
    </div>
  );
};

export default SideMsgBar;
