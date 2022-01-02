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
        const allUsers = database.collection("All_Users");

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
                if(products.length >= 1) {
                    res.send(products);
                }
                else {
                    res.status(404).json("Product Not Found")
                }
           }
           else if(productId) {
              products = await allProduct.findOne({_id: objectId(productId)});
              if(products === null) {
                  res.status(404).json('Product Not Found');
              }
              else {
                  res.send(products);
              }
           }
           else if(productName) {
               products = await allProduct.find({name: {$regex: productName.toLowerCase()}}).toArray();
               if(products.length >= 1) {
                   res.send(products);
               }
               else {
                   res.status(404).json("Product Not Found")
               }
           }
           else if(category !== true && productId !== true && productName !== true) {            
               products = await allProduct.find({}).toArray();
               res.send(products);
           }
           
           
        });

        app.get('/all-users', async(req, res) => {
            const users = await allUsers.find({}).toArray();
            res.send(users);
        });

        //All Post Api

        app.post('/create-new-user', async (req, res) => {
            const user = {
                name: "Sheikh Ariful Islam",
                age: 17,
            }

            const result = await allUsers.insertOne(user);
            res.send(result);
        });

        app.post('/add-product', async (req, res) => {
           

            res.end();
            
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
