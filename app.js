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
                products = await allProduct.find({productCategory: {$regex: ".*" + category + ".*", $options: 'ims'}}).toArray();
                if(products.length >= 1) {
                    res.send(products);
                }
                else {
                    res.status(404).json("Product Not Found")
                }
           }
           else if(productId) {
              if(productId.length === 24 ) {
                    products = await allProduct.findOne({_id: objectId(productId)});
                    if(products === null) {
                        res.status(404).json('Product Not Found');
                    }
                    else {
                        res.send(products);
                    }
              }
              else {
                  res.status(400).json("Please Provide A Valid Id");
              }
           }
           else if(productName) {
               products = await allProduct.find({productName: {$regex: ".*" + productName + ".*", $options: 'ims'}}).toArray();
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

        app.get('/chack-isAdmin', async(req, res) => {
            const {email} = req.query;
            const user = await allUser.findOne({email: email});
            let isAdmin = false;
            if(user?.role === 'admin') {
                isAdmin = true;
            }
            res.status(200).json({isAdmin});
        })

        //All Post Api

        app.post('/create-new-user', async (req, res) => {
            const user = req.body;
            const result = await allUsers.insertOne(user);
            res.send(result);
        });

        app.post('/add-product', async (req, res) => {           
            const product = req.body;
            const result = await allProduct.insertOne(product);
            res.send(result);           
            
        })

        //All Delete Request

        app.delete('/delete-single-product', async (req, res) => {
            const {prductId} = req.query;
            if(prductId && prductId.length === 24) {
                const result = await allProduct.deleteOne({_id: prductId});
                res.send(result);
                
            }
            else {
                res.status(400).json('Please Provide A Valid Id');
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
