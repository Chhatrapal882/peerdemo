import router from 'router'
import express from "express"
import userModel from '../modal/User.js';
export const authRoute = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
authRoute.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        console.log('hhhhhhhhhhhhh');
        // validation

        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });

        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            email,
            password: passwordHash,

        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    }
    catch (err) {
        console.log('hello');
    }
})


authRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }


        const existingUser = await userModel.findOne({ email: email });

        if (!existingUser) {
            
            return res
            .status(400)
            .json({ msg: "No account with this email has been registered." });
        }
        console.log("isMatch",existingUser.password);
        const isMatch = await bcrypt.compare(password, existingUser.password);
        console.log("isMatch",isMatch);
        
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        console.log('token',process.env.JWT_SECRET);
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: existingUser._id,
                existingUser
            },
        })
    }
    catch(err){
        return res.json({msg:err.message});
    }
})
