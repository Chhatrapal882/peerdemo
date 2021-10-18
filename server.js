import express from 'express';
import mongoose from "mongoose"
import auth from './routes/auth'

var app = express();
app.use(express.json());

mongoose.connect(
    'mongodb+srv://chhatrapal:lkBaiK5u3WOVBWat@cluster0.ni490.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(res=>console.log('db is connected'))
.catch(err=>console.log(err))

// app.post('/',auth)


const port = 8080
var server = app.listen(port, function () {
   console.log(`The server is running on port ${port}`);
   

})