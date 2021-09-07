const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors')

require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2iwiq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err)
  const itemCollection = client.db("deshiProduct").collection("items");
  const newItemCollection = client.db("deshiProduct").collection("newItem");
  app.get('/items',(req,res)=>{
   
    itemCollection.find()
    .toArray((err,items) =>{
      res.send(items)
    })
  })
  app.get('/oders', (req,res)=>{
    newItemCollection.find()
    .toArray((err,oders)=>{
      res.send(oders)
    })
  })

  app.get('/newitems/:id',(req,res)=>{
    itemCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err,items) =>{
      res.send(items[0])
    })
  })
   
  app.get('/editing',(req,res)=>{
    itemCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })

  })
   app.post('/oderAdded',(req,res)=>{
    const checKout = req.body;
    console.log('oder added',checKout);
    newItemCollection.insertOne(checKout)
    .then(result =>{
     
      res.send(result.insertedCount > 0)
    } )

   })


   app.post('/addEvent',(req,res)=>{
    const newEvent = req.body;
    console.log('adding new', newEvent)
    itemCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount >0)
    })

   })
   app.delete('/deletit/:id',(req,res)=>{
     const id = req.params.id;
     console.log(id)
    //  itemCollection.findOneAndDelete({_id: id})
    //  .then(documents =>res.send(!!documents.value))
   })

  // perform actions on the collection object
  
  // client.close();
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})