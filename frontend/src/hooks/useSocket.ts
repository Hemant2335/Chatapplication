export const useSocket = (url: string) => {
    const socket = new WebSocket(url);
    const connect = () => {
        socket.onopen = () => {
            console.log('Connected')
            socket.send('Hello from the client!')
        }
    }
    const disconnect = () => {
        socket.close();
    }
    return { socket, connect, disconnect }
}