import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  useEffect(() => {
    const cookie = cookies.token;
    if (cookie) {
      navigate("/Chat");
    }
  }, []);

  return (
    <div>
      <h1>Homepage</h1>
    </div>
  );
};
export default Homepage;
