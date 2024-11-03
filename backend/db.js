const mongoose =require('mongoose');

mongoose.connect('mongodb+srv://harsh:VkT6BZk38uxE7hSh@cluster88.2ho6r1f.mongodb.net/')

const userSchema = new mongoose.Schema({
    username:String,
    firstName: String,
    lastName: String,
    password: String 
});

const bankSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', bankSchema)

module.exports ={
    User,
    Account
};
