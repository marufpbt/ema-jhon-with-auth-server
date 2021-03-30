
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()
const port = 5000

app.use(cors())
app.use(bodyParser.json())


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edbhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
	const productsCollection = client.db("ema-john").collection("shopping");

	app.post('/addProduct', (req, res) => {
		const products = req.body;
		productsCollection.insertOne(products)
			.then(result => {
				res.send(result.insertedCount)
				console.log("result", result);
			})
	})

	app.get('/products', (req, res) => {
		productsCollection.find({})
			.toArray((err, documents) => {
				res.send(documents)
			})
	})

	app.get('/product/:key', (req, res) => {
		productsCollection.find({ key: req.params.key })
			.toArray((err, documents) => {
				res.send(documents[0])
			})
	})

	app.post('/productsBykeys', (req, res) => {
		const productKeys = req.body;
		productsCollection.find({ key: { $in: productKeys } })
			.toArray((err, documents) => {
				res.send(documents)
			})
	})


	// client.close();
});


app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(process.env.PORT || port)
