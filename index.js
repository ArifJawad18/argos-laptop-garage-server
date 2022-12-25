const express = require( 'express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { query, response } = require('express');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT  || 5000;


const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bckes0p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    const allserviceCollection = client.db('laptopPortal').collection('allservice');
    const orderCollection = client.db('laptopPortal').collection('orders')
    
    app.get('/allservice', async(req, res) => {
      const query = {};
      const cursor = allserviceCollection.find(query);
      const allservice = await cursor.toArray();
      res.send(allservice); 
    });

    app.get('/allservice/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const allservice = await allserviceCollection.findOne(query);
      res.send(allservice)
    });

    //orders api
    app.get('/orders', async(req, res) =>{
     let query = {};
     if(req.query.email){
      query = {
        email:req.query.email
      }
     }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray()
      res.send(orders);
    });

    app.post('/create-payment-intent', async (req, res) => {
      const orders = req.body;
      const price = orders.price;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
          "card"
        ]
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });

    });

    app.post('/payments', async(req, res)=>{
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      const _id = payment.orderId
      const filter = {_id: ObjectId(id)}
      const updatedDoc = {
      $set:{
        paid: true,
        transactionId: payment.transactionId
        
      }
    }
    const updatedResult = await orderCollection.updateOne(filter, updatedDoc)
    res.send(result)
      
      res.send(result);
    })


    app.get('/jwt', async(req, res) =>{
    const email = req.query.email;
    const query = {email: email};
    const user = await orderCollection.findOne(query);
    if(user){
      const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn:'1h'})
      return res.send({accessToken:token})
    }
    res.status(403).send({accessToken: ''})
    })

    app.get('/orders/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const orders = await orderCollection.findOne(query);
      res.send(orders);
    })

  

    app.patch('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const status = req.body.status
      const query = {_id: ObjectId(id) }
      const updateDoc = {
        $set:{
          status: status
        }
      }
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);

    });

      //temporary price //

      // app.get('/addPrice', async (req, res) => {
      //   const filter = {}
      //   const options = { upsert: true }
      //   const updateDoc ={
      //     $set:{
      //       price : 100
      //     }
      //   }
      //   const result = await allserviceCollection.updateMany(filter, updateDoc, options)
      //   res.send(result);

      // })




    app.post('/orders', async(req, res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.delete('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result)
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









