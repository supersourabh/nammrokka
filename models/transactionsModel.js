const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    ammount: { type: Number, required: true },
    payment: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },

})

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;