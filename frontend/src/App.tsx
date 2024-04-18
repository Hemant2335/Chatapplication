import { useEffect , useState } from 'react'
import { useSocket } from './hooks/useSocket'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import { BrowserRouter , Route, Routes } from 'react-router-dom'


function App() {

  const [message, setmessage] = useState<string | null>(null)
  const {socket, connect, disconnect} = useSocket('ws://localhost:8080');

  useEffect(()=>{
    connect()
    socket.onmessage = (event) => {
      setmessage(event.data)
    }
    return () => {
      disconnect()
    }
  },[])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/Signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
