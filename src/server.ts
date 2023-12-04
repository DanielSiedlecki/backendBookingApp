import express from 'express';
import connectDB from './config/dbConnection'
import createUser from './controllers/auth.controller'
require('dotenv').config()

connectDB();
const app = express();
const port = process.env.PORT || 3030;
app.use(express.json());


app.post('/login', createUser);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});