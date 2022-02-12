const Express = require("express");
const mongoose = require("mongoose");
const User = require("./models/usermodel")
const date = require("date-and-time");
const Transaction = require("./models/transactionsModel");
const TransactionAmmount = require("./models/transaction_ammount_model");
const { findOne } = require("./models/usermodel");
const bodyParser = require("body-parser");


const app = Express();
const now = new Date;
const today = date.format(now, "DD/MM/YYYY")

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to database");
    }
})

app.use(bodyParser())


app.get("/home", async (req, res) => {

    //const id = req.query.id
    try {
        //const user = await User.find({id : id}) 
        const members = await User.find({});
        res.send({ "members": members })
    } catch (error) {
        res.status(404).send({ "error": error.members })
    }

})


app.post("/newUser", async (req, res) => {
    try {
        const name = req.body.name
        const password = req.body.password
        const mobile = req.body.mobile
        const imgsrc = req.body.imgsrc


        const newUser = new User({
            name: name,
            password: password,
            ammount: 0,
            mobile: mobile,
            lastModify: today,
            imgsrc: imgsrc ? imgsrc : "https://th.bing.com/th/id/R.d5ab227d8ebdd936fb9b84b51d081593?rik=o%2fPk027oEmFMgw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-PNG-Pic.png&ehk=0FJooPvxKa0xfIp1WYAilugP%2fGaKxSKwQrY83E8g0QE%3d&risl=&pid=ImgRaw&r=0"
        })
        const created = await newUser.save();
        res.send(created)
    } catch (error) {
        res.status(500).send({ "error": error.message })
    }

})

app.get("/transactions/add", async (req, res) => {
    try {

        const fromId = "6202ad0a745a305315569063"
        const toId = "6202ad0a745a305315569062"
        const ammount = 300
        const payment = "Paytm"
        const subject = "avenue bhajji"

        const trans = new Transaction({
            fromId: fromId,
            toId: toId,
            ammount: ammount,
            payment: payment,
            subject: subject,
        })

        //finding transaction ammount model if exists
        const transAmtmodel = await TransactionAmmount.findOne({ fromId: fromId, toId: toId })

        if (transAmtmodel == null) {
            const transAmt = new TransactionAmmount({
                fromId: fromId,
                toId: toId,
                ammount: ammount
            })
            var newAmt = await transAmt.save()
        } else {
            await TransactionAmmount.findOneAndUpdate({ fromId: fromId, toId: toId }, { $inc: { ammount: ammount } })
            var updatedTAM = await TransactionAmmount.findOne({ fromId: fromId, toId: toId })
        }
        //trasaction save
        const newTrans = await trans.save()

        //user ammount update
        await User.findOneAndUpdate({ fromId: fromId }, { $inc: { ammount: ammount } })
        const user = await findOne({ id: fromId })

        res.send({ "newTrans": newTrans, "newAmmt": transAmtmodel == null ? newAmt : updatedTAM, "user": user })

    } catch (error) {
        res.status(500).send({ "error": error.message })

    }
})

app.get("/transactions/:fromId/:toId", async (req, res) => {
    const fromId = req.params.fromId;
    const toId = req.params.toId;
    try {
        const transactions = await Transaction.find({ fromId: fromId, toId: toId }).skip(0).limit(20).sort({ date: -1 })
        res.send({ "transactions": transactions })
    } catch (error) {
        res.status(401).send({ "error": error.message })
    }

})


app.post("/transactions/devideAmmount", async (req, res) => {
    //
})

app.listen(4000, () => { console.log("Server started at http://localhost:4000/") })