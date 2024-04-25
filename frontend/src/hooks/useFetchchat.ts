import { chatstate } from "../store/atoms/Chat";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";


export const useFetchchat = async() =>{
    const setchat = useSetRecoilState(chatstate);
    const navigate = useNavigate();
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/getchats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token") || ""
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