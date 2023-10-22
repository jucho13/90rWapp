import {chatService} from "../services/factory.js";
// import { Socket } from "socket.io";

// const io = new Socket();
const getRenderChatController = async (req, res) => {
    res.render('chat');
}

const postNewChatController = async (req, res) => {
    const userName = req.body.userName;
    const message = req.body.message;
    console.log(userName);
    console.log(message);
    if (userName && message) {
        const result = await chatService.writeMessage(userName, message);
        // io.emit('message', message);
        res.send(result);
    } else {
        res.send('{"status":"failed", "message":"Incomplete params"}');
    }
}


export { getRenderChatController, postNewChatController}