import { Server } from "socket.io";
import Message from "./dao/models/message.model.js";

const socket = {};

socket.connect = (server) => {
    socket.io = new Server(server);

    socket.io.on("connection", async (socketInstance) => {
        console.log(`${socket.id} connected`)

        const messageHistory = await Message.find().sort({timestamp: 1});
        socketInstance.emit("messageLogs", messageHistory);

        socketInstance.on("message", async (data) => {
            const newMessage = new Message(data);
            await newMessage.save();

            socket.io.emit("newMessage", [newMessage]);
        })

        socketInstance.on("user-autenticated", (data) => {
            socketInstance.broadcast.emit("user-connected", data);
        });
    });
};

export default socket;