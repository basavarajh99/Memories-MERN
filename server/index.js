import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

dotenv.config()
const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes)

app.get("/", (req, res) => {
    res.send("You are in Memories");
})

//mongo connect

// const CONNECTION_URL = "mongodb+srv://Basavaraj:Abcd%401234@freecodecamp.xgxjbef.mongodb.net/memoriesDB?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.error(error));





