import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";

function App() {
  const [message, setmessage] = useState<string | null>(null);
  const { socket, connect, disconnect } = useSocket("ws://localhost:8080");

  useEffect(() => {
    connect();
    socket.onmessage = (event) => {
      setmessage(event.data);
    };
    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <CookiesProvider>
        <RecoilRoot>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Chat" element={<Chat />} />
            </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </CookiesProvider>
    </>
  );
}

export default App;
