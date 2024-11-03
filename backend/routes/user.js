// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
//const { User, Account } = require("../db");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})


router.get("/print", authMiddleware, async (req, res) => {
    try {
        // Retrieve the user by userId (assuming it's available via authMiddleware)
        //Bhai _id pe changes karna na ki account ka userId which is being referenced 
        // to User schema
        const user = await User.findOne({ _id: req.userId });

        // If no user is found, return a 404 response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back user data without the password field for security reasons
        res.json({
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
                // password intentionally omitted in the response
            }
        });
    } catch (error) {
        // Return a 500 response if an error occurs during the database query
        res.status(500).json({ message: "An error occurred while fetching user data" });
    }
});








router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId = user._id;

    // await Account.create({
    //     userId,
    //     balance: 1 + Math.random() * 10000
    // })
    console.log(req.body)
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

      await User.updateOne(
        { id: req.userId },     // Filter to find the user by `userId`
        { $set: req.body }      // Update fields from the request body
        );

    console.log(req.body)

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;




















































































































































/*const express = require('express');
const zod=require("zod");
//const { User, Accounts } = require("../db");
const { User } = require("../db");
const jwt=require("jsonwebtoken");
const { JWT_SECRET }= require("../config");
const { authMiddleware } = require("../middleware");
const app = express.Router();


const signupSchema = zod.object({
    username: zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()

})

const signinSchema=zod.object({
    username: zod.string().email(),
    password:zod.string()
})
const signUpdateSchema = zod.object({
    
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string()

})

app.post('/signup',async (req,res)=>{
    const body =req.body;
    const {success}=signupSchema.safeParse(body);

    if(!success){
        return res.statusCode.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const exisitingUser = User.findone({
       username:req.body.username
    })

   if(exisitingUser){
    res.json({
        message: "Email already taken / Incorrect inputs"
    })
   }

   const user =await User.create({
    username:req.body.username,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    password:req.body.password
    })
   //const dbUser = await User.create(body);
   const userId=user._id;
   const token =jwt.sign({
    userId
   },JWT_SECRET);

   res.json({
     message:"UserCreated Successfully",
     token:token
   })
    
})

app.get('/signin',function(req,res){
    
    const {success}=signinSchema.safeParse(body);

    if(!success){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = User.findone({
        username:req.body.username,
        password:req.body.password
     })
 
     if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})

app.put("/",authMiddleware, async (req,res)=>{
    const {success} = signUpdateSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    }
  await User.updateOne({_id: req.userId }, req.body);
  res.json({
    message: "Updated successfully"
  })
})

app.get("/bulk", async (req,res)=>{
    
        const filter = req.query.filter || "";
    
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })
    
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
})
module.exports = app*/