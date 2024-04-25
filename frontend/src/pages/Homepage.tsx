import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token") ;
    if (token) {
      navigate("/Chat");
    }
  }, []);

  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={()=>navigate("/login")}> Login</button>
    </div>
  );
};
export default Homepage;
