import mongoose from 'mongoose';

const messagesCollection = 'messages';

const chatSchema = new mongoose.Schema({
    user: String,
    message: String
});

export const chatModel = mongoose.model(messagesCollection, chatSchema);