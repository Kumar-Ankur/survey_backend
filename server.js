
const express = require("express")
const bodyParser = require("body-parser")
const { MongoClient, ServerApiVersion } = require('mongodb');
const password = encodeURIComponent('Anjali@123')
const MONGODB_URI = `mongodb+srv://akakankur81:${password}@cluster0.ysutnjo.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

let db;

const PORT = process.env.PORT || '9001'

const app  = express()

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type, Authorization, Cache-Control"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    return next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      db = await client.db("survey").collection('reports')
      console.log("You successfully connected to MongoDB!");
    } catch(err){
        console.log(err)
    }
  }
  run().catch(console.dir);

app.post('/submit', async (req, res) => {
    try {
        await db.insertOne(req.body);
        res.status(200).json({ message: 'success'});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.get('/fetchReport', async(req, res) => {
  const records = await db.find().toArray()
  res.json({ records });
})

app.post('/login', (req, res) => {
  const {username, password} = req.body
  if(username === 'aashvi' && password === 'admin123') {
    res.status(200).send({ message: 'Login successfully'})
  } else {
    res.status(500).send({ message: 'Authentication failed'})
  }
})

app.listen(PORT, () => {
    console.log(`Server is running: ${PORT}`)
})
