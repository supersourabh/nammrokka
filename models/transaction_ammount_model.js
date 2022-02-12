const mongoose = require("mongoose")


const transAmmountSchema = new mongoose.Schema({
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    ammount: { type: Number }

},
    {
        timestamps: true
    }
)


const TransactionAmmount = mongoose.model("TransactionAmmount", transAmmountSchema)

module.exports = TransactionAmmount