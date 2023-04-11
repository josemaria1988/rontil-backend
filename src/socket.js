import { Server } from "socket.io";

const socket = {};

socket.connect = (server) => {
    socket.io = new Server(server);

    socket.io.on("connection", (socket) => {
        console.log(`${socket.id} connected`)
    });
    socket.io.on("message", (data) => {
        messages.push(data);
        io.emit("messageLogs", messages);
      });
  
      socket.io.on("user-autenticated", (data) => {
        socket.broadcast.emit("user-connected", data);
      });
};

export default socket;