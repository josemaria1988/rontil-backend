import { Server } from "socket.io";

const socket = {};

socket.connect = (server) => {
    socket.io = new Server(server);

    socket.io.on("connection", (socketInstance) => {
        console.log(`${socket.id} connected`)

        socketInstance.on("message", (data) => {
            const messages = [];
            messages.push(data);
            socket.io.emit("messageLogs", messages);
        });

        socketInstance.on("user-autenticated", (data) => {
            socketInstance.broadcast.emit("user-conected", data);
        });
    });
};

export default socket;