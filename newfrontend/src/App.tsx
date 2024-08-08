import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const newsocket = new WebSocket("ws://localhost:8080");

  newsocket.onopen = () => {
    console.log("Connected to server");
    const userID  = Math.random().toString(36).substring(2, 15);
    newsocket.send(JSON.stringify({type : "createUser" , id : userID}));
  };

  newsocket.onmessage = (msg) => {
    console.log("Message from server", msg.data);
  };

  newsocket.onclose = () => {
    console.log("Disconnected from server");
  };


  const handleSend = () => {
    const message  = {
      type : "private",
      content : "Hello from client"
    }
  }

  return (
    <>
        <div style={{gap : "2vw" , display : "flex"}}>
          <input type="text" />
          <button>Send</button>
        </div>
        
    </>
  )
}

export default App
