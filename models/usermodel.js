const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true, default: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    ammount: { type: Number, required: true },
    lastModify: { type: String, required: true },
    imgsrc: { type: String, required: true }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;