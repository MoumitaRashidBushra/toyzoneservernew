const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//console.log(process.env.DB_PASS)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idh7yj4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        client.connect();


        const addAToyCollection = client.db('toyZone').collection('addAToy');

        app.get('/addAToys', async (req, res) => {
            const sort = req.query?.sort;

            console.log(req.query.email);

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }

            const value = sort === 'dese' ? -1 : 1;

            const result = await addAToyCollection.find(query).sort({ price: value }).toArray();
            res.send(result);
        })


        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addAToyCollection.findOne(query);
            res.send(result);
        })


        app.post('/addAToys', async (req, res) => {
            const addToy = req.body;
            console.log(addToy);
            const result = await addAToyCollection.insertOne(addToy);
            res.send(result);
        })

        app.delete('/addAToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addAToyCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/addAToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body;
            const toy = {
                $set: {
                    price: updatedToy.price,
                    available_quantity: updatedToy.available_quantity,
                    detail_description: updatedToy.detail_description,
                    sub_category: updatedToy.sub_category

                }
            }
            const result = await addAToyCollection.updateOne(filter, toy, options);
            res.send(result);
        })


        app.get('/alltoy', async (req, res) => {
            const cursor = addAToyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/alltoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addAToyCollection.findOne(query);
            res.send(result);

        })




        app.get('/data/:sub_category', async (req, res) => {

            const result = await addAToyCollection.find({ sub_category: req.params.sub_category, }).toArray();
            res.send(result);

        })


        app.get('/toySearch/:title', async (req, res) => {

            const result = await addAToyCollection.find({ toy_name: { $regex: req.params.title, $options: "i" } }).toArray();
            res.send(result);

        })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Toy Zone is Running')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})