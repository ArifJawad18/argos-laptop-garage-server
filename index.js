const express = require( 'express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;



const app = express();

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpdjg4i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const allserviceCollection = client.db('argoslaptopgarage').collection('allservice');
        app.get('/allservice', async(req, res) =>{
            const query ={};
            const options = await allserviceCollection.find(query).toArray();
            res.send(options)
        })


    }
    finally{

    }

}
run().catch(console.log);



app.get('/', async(req, res) =>{
    res.send('argos laptop garage port server is running');
})

app.listen(port, () => console.log(`argos laptop garage port server is running ${port}`))