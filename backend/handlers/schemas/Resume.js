import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    file_url: String,
    parsed_text: String,
    AiFeedBack: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("users", UserSchema);
