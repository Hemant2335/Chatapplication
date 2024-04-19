import { useEffect } from "react";
import { userState } from "../store/atoms/User";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [user, setuser] = useRecoilState(userState);
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if (!data.Status) {
        alert(data.error);
        return navigate("/login");
      }
      setuser(data.user);
    } catch (error) {
        return console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
        {user?.name}
    </div>
  )
};

export default Chat;
