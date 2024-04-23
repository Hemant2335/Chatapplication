import { chatstate } from "../store/atoms/Chat";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";


export const useFetchchat = async(userid : any) =>{
    const setchat = useSetRecoilState(chatstate);
    const navigate = useNavigate();
    try {
        const res = await fetch("http://localhost:3000/api/chat/getchats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        const data = await res.json();
        if (!data.Status) {
          alert(data.error);
          return navigate("/login");
        }
        console.log("Fetched new Chats" , data.chats);
        setchat(data.chats);
        return data.chats;
      } catch (error) {
        return console.log(error);
      }
   

    

}