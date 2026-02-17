import { Server } from "socket.io"

export default (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        },
    })

    let users = []
    
    io.on('connection', (socket) => {
        socket.on('addUser', userId => {
            users = users.filter(user => user.userId !== userId)
            users.push({ userId: userId, socketId: socket.id })
        })

        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
            const userObj = users.find(user => user.userId === receiverId)
            if(userObj){
                io.to(userObj.socketId).emit('getMessage', {
                    senderId,
                    text,
                })
            }
        })

        socket.on('disconnect', () => {
            users = users.filter(user => user.socketId !== socket.id)
        })

    })
}