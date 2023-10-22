import { chatModel } from '../db/models/chatModel.js';
export default class chatService {
    constructor() {
        this.messages = [];
        console.log(this.messages);
    }

    async getMessages() {
        try {
            const messages = await chatModel.find({});
            return messages;
        } catch (error) {
            console.log(error);
        }
    }

    async writeMessage(userId, message) {
        try {
            await chatModel.create({ user: userId, message: message });
            return '{"status": "ok", "message": "Message created successfully"}';
        } catch (error) {
            console.log(error);
            return '{"status": "failed", "message": "Error when creating message"}';
        }
    }
}