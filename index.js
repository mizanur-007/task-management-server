const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

// mongodb connect 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tasks.qcpkjut.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const tasksCollection = client.db("TaskSwift").collection("task");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    // Send a ping to confirm a successful connection
     client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// get operations 
app.get("/", (req, res) => {
    res.send("app is running");
  });

  app.get("/tasks", async(req,res)=>{
    try{
        const page = parseInt(req.query.currentPage);
    const size = parseInt(req.query.size);
    const result = await tasksCollection.find().skip(page*size).limit(size).toArray()
    const count = await tasksCollection.estimatedDocumentCount();
    res.send({result, count})
    }
    catch{
        console.log("error")
    }
  })

  //cookie post with jwt
  app.post("/jwt",async(req,res)=>{
    const data = req.body;
    const token = jwt.sign(data, process.env.ACCESS_TOKEN, {expiresIn:"5h"})
    res
    .cookie('token',token, {
        httpOnly: true,
        secure :false
    })
    .send({msg:'Succeed'});

  })

  app.listen(port, ()=>{
    console.log("app is running")
  })