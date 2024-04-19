type SocketProps = {
    url: string
    user: any
}


export const useSocket = (url : string , user : any) => {
    const socket = new WebSocket(url);
    const connect = () => {
        const Message = JSON.stringify({
            type : 'user',
            id : user.id,
        })
        socket.onopen = () => {
            console.log('Connected')
            socket.send(Message);
        }
    }
    const disconnect = () => {
        socket.close();
    }
    return { socket, connect, disconnect }
}