// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { User, Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/balance", authMiddleware, async (req, res) => {
    
    const user = await User.findOne({ _id: req.userId });
    if (!user){
        return res.status(404).json({ message: "User not found" })
    }
     const amount = await Account.create({
        userId: req.userId,
        balance:req.body.amount
    });

    res.json({
        balance: amount.balance
    })
});

router.put("/balance", authMiddleware, async (req, res) => {
    const response=req.body;
    const user = await User.findOne({ _id: req.userId });
    if (!user){
        return res.status(404).json({ message: "User not found" })
    }
     const amount = await Account.updateOne({ userId: req.userId }, { $inc: { balance: response.amount } })

    res.json({
        balance: amount.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
    session.endSession();
});

module.exports = router;