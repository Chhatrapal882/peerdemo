import router from 'router'
import express from "express"
import userModel from '../modal/User.js';
export const authRoute = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const options = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http:localhost:3000',
    preflightContinue: false,
}

authRoute.use(cors(options));
authRoute.options('*', cors(options))



authRoute.post("/tokenIsValid", async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        const token = req.header("token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await userModel.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

authRoute.post('/signup', async (req, res) => {

    try {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        let { username, email, password } = req.body;
        // validation

        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." })
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
        console.log(err);
    }
})

authRoute.get('/user',async (req, res) => {
    
    try {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        const token = req.header("token");
        if (!token)
            return res.status(401).json({ msg: "No authentication token, access denied" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token,"----------------------",process.env.JWT_SECRET);
        console.log("verified",verified);
        if (!verified)
            return res.status(401).json({ msg: "Token verification failed, authorization denied" });

        req.user = verified.id;
        console.log(req.user);
        const user = await userModel.findById(req.user);
        console.log(user);
        res.json({
          user: user,
          id: user._id
      
        })    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  
})
authRoute.post('/login', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." })
        }
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: existingUser._id,
                existingUser
            },
        })
    }
    catch (err) {
        return res.json({ msg: err.message });
    }
})


authRoute.get('/users', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    const user = await userModel.find();
    res.json({
        users:user,
        id: userModel._id

    })
})

authRoute.post('/logout', async (req, res) => {
    const {id,logouttime} = req.body
    console.log(logouttime);
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    const user = await userModel.findByIdAndUpdate(id,{$push:{logout:logouttime}});
    res.json({
        users:user,
        id: userModel._id

    })
})