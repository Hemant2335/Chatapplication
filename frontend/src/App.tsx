import { useEffect , useState } from 'react'
import { useSocket } from './hooks/useSocket'
import './App.css'

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
      {(message === null) ? (<h1>Loading...</h1>) : (<h1>{message}</h1>)}
    </>
  )
}

export default App
