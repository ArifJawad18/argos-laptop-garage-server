const express = require( 'express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const { query } = require('express');
require('dotenv').config()
const port = process.env.PORT  || 5000;



const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bckes0p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    const allserviceCollection = client.db('laptopPortal').collection('allservice')
    
    app.get('/allservice', async(req, res) => {
      const query = {};
      const options = await allserviceCollection.find(query).toArray();
      res.send(options);
    })

  }
  finally{

  }

}
run ().catch(console.log)



app.get('/', async(req, res) =>{
    res.send('argos laptop garage server is running')
})

app.listen(port, () => console.log(`argos laptop garage server is running on ${port}`))









