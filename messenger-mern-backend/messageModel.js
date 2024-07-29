import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    username: String,
    message: String,
    timestamp: String,
})

export default mongoose.model('messages', messageSchema);  // we need to put plural words here 