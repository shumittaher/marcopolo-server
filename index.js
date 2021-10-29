const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egg9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {

        await client.connect()
        console.log('connection success')
        const database = client.db('marco-polo-database')
        const servicesCollection = database.collection("marco-polo-services")
        const scheduleCollection = database.collection("marco-polo-schedules")

        //post service API
        app.post('/addService', async (req, res) => {
            const newService = req.body
            const result = await servicesCollection.insertOne(newService)
            res.json(result)
        })

        //post schedule API
        app.post('/addSchedule', async (req, res) => {
            const newSchedule = req.body
            const result = await scheduleCollection.insertOne(newSchedule)
            res.json(result)
        })

        //GET service API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.json(services)
        })

        //GET specific schedule API
        app.get('/schedule/:email', async (req, res) => {
            const email = req.params.email
            const query = { userEmail: email };
            const cursor = await scheduleCollection.find(query)
            const schedule = await cursor.toArray()
            console.log('hit the single get api', query, schedule)
            res.json(schedule)
        })

        //Delete trip API
        app.delete('/schedule/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            console.log('deleting user with ID', id)

            const result = await scheduleCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }

            res.json(result)
        })

        //GET schedule API
        app.get('/allSchedules', async (req, res) => {
            const cursor = scheduleCollection.find({})
            const schedule = await cursor.toArray()
            res.json(schedule)
        })

    } finally {
        // await client.close();
    }
}



app.get('/', (req, res) => {
    res.send('Running marco polo Server')
})

app.listen(port, () => {
    console.log('running marco polo server on port :', port)
})

run().catch(console.dir);
