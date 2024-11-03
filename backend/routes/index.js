const express = require('express');
const userRouter=require("./user");
const accountRouter=require("./accounts")
// const cors = require("cors");
// const app=express();
const router = express.Router();



// app.use(cors());
// app.use(express.json());
router.use("/user",userRouter);
router.use("/account",accountRouter);

module.exports = router;
