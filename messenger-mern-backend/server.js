//importing our dependecy
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';

import mongoMessages from './messageModel.js'

//app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "",
    key: "",
    secret: "",
    cluster: "",
    useTLS: true
});

//middlewarwa
app.use(express.json())
app.use(cors())


//db config
const mongoURI = 'mongodb+srv://admin:PCxO4j1z6z6mdcfv@cluster0.s6yja.mongodb.net/messengerDB?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once('open',()=>{
    console.log('DB CONNECTED')

    const changeStream = mongoose.connection.collection('messages').watch()

    changeStream.on('change', (change) => {
        pusher.trigger('messages', 'newMessages', {
            'change': change
        })
    })
})

//api routes
app.get('/', (req,res) => res.status(200).send('hello world'));

app.post('/save/message', (req, res) => {
    const dbMessage = req.body
    // console.log(dbMessage)

    mongoMessages.create(dbMessage,(err, data) => {
        if(err) {
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})


app.get('/retrieve/conversation', (req, res) => {
    mongoMessages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        }else{
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(201).send(data);
        }
    })
})


//listner
app.listen(port, () => console.log(`listning on localhost: ${port}`))
