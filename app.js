const express  = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config()
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.jrudo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("B2Me");
        const allProduct = database.collection("All_Product");

        //All Get Api
        
        app.get('/', async (req, res) => {
            res.send("Well Come") 
        });
        
        

        app.get('/all-products', async (req, res) => {
           const {category} = req.query;
           const {productId} = req.query;
           const {productName} = req.query;

           let products;

            if(category) {
                products = await allProduct.find({category: category}).toArray();
                res.send(products);
           }
           else if(productId) {
               products = await allProduct.find({_id: objectId(productId)});
               res.send(products);
           }
           else if(productName) {
               products = await allproduct.find({productName: productName}).toArray();
           }
           else if(category !== true && productId !== true && productName !== true) {
               products = await allProduct.find({}).toArray();
               res.send(products);
           }
           
           
        })
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        // await client.close();
    }

    
}

run();




const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
