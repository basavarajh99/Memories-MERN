import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

dotenv.config()
const app = express(); //every express app need this line to start


app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
/*
    bodyParser middleware parses incoming requests with JSON payloads and makes the data available on req.body.
    
    It ensures the server can handle requests where the body contains JSON data, such as those sent with 
    Content-Type: application/json

    limit: "30mb" = Sets the maximum request body size to 30mb. If a request exceeds this size, 
                    the server will reject it with a 413 Payload Too Large error.
    
    extended: true = Useful when using bodyParser.urlencoded() to parse URL-encoded data, not JSON data.


*/

app.use(cors()); //this always needs to be on top of all the routes. Otherwise we get network routing errors
/*
    Cross-Origin Resource Sharing (CORS): 
    It allows a server to specify which origins (domains) are permitted to access its resources. 
    
    Browsers implement this as a security feature to prevent unauthorized access to resources from scripts 
    running on different origins (domains or ports).
    
    By default, browsers block requests to API from origins other than the server's origin. 
    Without CORS enabled, these requests would fail due to the Same-Origin Policy.
    
    When to use CORS:-
    Single-Origin Apps: If your frontend and backend are hosted on different domains, you need to configure 
    CORS. APIs for External Use: If your API will be accessed by third parties, you must use CORS to specify 
    what is allowed.    
    
        const corsOptions = {
        origin: 'http://localhost:3000', // Allow only this origin
        methods: 'GET,POST',            // Allow only GET and POST methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
        credentials: true               // Allow cookies/auth headers
    };

    app.use(cors(corsOptions));
*/

app.use('/posts', postRoutes);

/*
    first parameter sets up the starting path for all the routes inside of posts.js file and second one 
    includes those actual routes. In short it means that " Every route inside of postRoutes gonna start with 
    URL(http://localhost:5000)suffixed with '/posts' " 
*/

app.use('/user', userRoutes)

app.get("/", (req, res) => {
    res.send("You are in Memories");
})

//mongo connect

// const CONNECTION_URL = "mongodb+srv://Basavaraj:Abcd%401234@freecodecamp.xgxjbef.mongodb.net/memoriesDB?retryWrites=true&w=majority";


/*
    DB hosted on MongoDB Atlas cloud. It creates a free shared cluster which act as online cloud db
    Login Credentials are used to connect to DB
    Adding specific IP address to connect to db
*/
const PORT = process.env.PORT || 5000; //PORT # specified by backend host or local port 5000

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.error(error));

/* 
    mongoose.connect() function is a JS promise that establishes a connection to the MongoDB database.

    A Promise in JavaScript represents a value that will be available in the future, either resolved 
    successfully or rejected with an error. 
    
    Promises have three states:
        Pending: The promise is still waiting to resolve or reject.
        Fulfilled (Resolved): The operation completed successfully.
        Rejected: The operation failed with an error.
        Promises are used for asynchronous operations like fetching data, file I/O, or connecting to a database.
    
    "useNewUrlParser: true:" This avoids deprecation warnings for older parsers.
    "useUnifiedTopology: true:" Helps resolve connection issues and deprecation warnings.
    "then()" This is the success callback executed when the connection to the database is successfully 
             established. 
    "app.listen(PORT, callback)": Starts the Express server and listens for incoming 
                                  requests on the specified port (PORT)
    "catch()" This is the error callback executed if the connection to the database fails.
*/





