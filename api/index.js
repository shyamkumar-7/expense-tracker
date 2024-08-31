require('dotenv').config();
const express= require('express');
const cors=require('cors')
const app=express();
const Transaction=require('./models/transaction.js');
const { default: mongoose } = require('mongoose');


const MONGO_URL=process.env.MONGO_URI;
const PORT = 3050;

app.use(cors());
app.use(express.json())

async function connectToDatabase() {
    try {
      await mongoose.connect(MONGO_URL);
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }

  connectToDatabase();


  

app.get('/api',(req,res)=>{
    res.send("hello server")
})

app.post('/api/transaction', async (req, res) => {

    const { name, description, datetime, price } = req.body;

    try {
      const transaction = await Transaction.create({ name, description, datetime, price });
      res.status(201).json(transaction); // Status 201 for resource creation
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.delete('/api/transaction/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(id);
  
      if (!deletedTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
  
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.get('/api/transactions', async (req,res)=>{
    const transactions=await Transaction.find();
    res.json(transactions);
  })
  


app.listen(PORT,()=>{
    console.log(`server running at PORT ${PORT}`)
})