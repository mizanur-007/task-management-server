const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const todoCollection = client.db("TaskSwift").collection("todo");

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

  app.get("/api/v1/tasks", async(req,res)=>{
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

  //task with id
  app.get("/api/v1/tasks/:id",async(req,res)=>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await tasksCollection.findOne(query);
    res.send(result)
  })


  //todolist
  app.get('/api/v1/todolist',async(req,res)=>{
    const result = await todoCollection.find().toArray()
    res.send(result)
  })



  //update a doc
  app.put('/api/v1/update/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedTask = req.body;
    const query = {_id: new ObjectId(id)};
    console.log(id,updatedTask)
    const option = {upsert: true }
    const updatedDoc = {
      $set:{
        projectTitle: updatedTask.projectTitle,
        task: updatedTask.task,
        shortDescription: updatedTask.shortDescription,
        detailInformation: updatedTask.detailInformation,
        dueDate: updatedTask.dueDate
      }
    }
    const result = await tasksCollection.updateOne(query,updatedDoc,option);
    res.send(result)
  })


  //cookie post with jwt
  app.post("/api/v1/jwt",async(req,res)=>{
try{
    const data = req.body;
    const token = jwt.sign(data, process.env.ACCESS_TOKEN, {expiresIn:"5h"})
    res
    .cookie('token',token, {
        httpOnly: true,
        secure :false
    })
    .send({msg:'Succeed'});
}
catch{
    console.log("error")
}

  })
  //cookie clear with jwt
  app.post("/api/v1/logout",async(req,res)=>{
try{
    const data = req.body;
    res
    .clearCookie('token',{maxAge: 0})
    .send({msg:'Succeed'});
}
catch{
    console.log("error")
}

  })

  // todo list 
  app.post('/api/v1/todolist',async(req,res)=>{
    const data = req.body;
    const result = await  todoCollection.insertOne(data)
    console.log(result)
    res.send(result)
  })

  //add a task
  app.post('/api/v1/tasks', async(req,res)=>{
    try{
      const data = req.body;
      const result = await tasksCollection.insertOne(data);
res.send(result)
    }
    catch{
      console.log(error)
    }
  })

  //delete a task from todolist
  app.delete('/api/v1/todolist/:id', async(req,res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await todoCollection.deleteOne(query)
    res.send(result)
  })

  app.listen(port, ()=>{
    console.log("app is running")
  })