import express from 'express';
import mongoose from "mongoose"
import { authRoute } from './routes/auth.js'
import env from 'dotenv'
var app = express();
app.use(express.json());
env.config()
mongoose.connect(
    process.env.MONGO_DB
    , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(res => console.log('db is connected'))
    .catch(err => console.log(err))

app.use('/', authRoute)

const port = process.env.PORT | 8080
var server = app.listen(port, function () {
    console.log(`The server is running on port ${port}`);
})