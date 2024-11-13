const express = require('express');
const app = express();
require('dotenv').config();
const useroute = require("./route/useroute");
const port = process.env.port || 3000; 
const cors = require('cors');
const connectdb = require("./config/connectdb");
const Bookroute= require("../Backend/route/bookroutes");
app.use(cors())
// Connect to the database
connectdb()
// use cors: por si acaso el localhost de backend and frontend son diferentes 


 // Usar CORS con las opciones específicas
// Middleware for parsing JSON
app.use(express.json());

//path of bookroute
app.use('/book',Bookroute)

// Main authentication route
app.use("/auth", useroute);

app.listen(port, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port => ${port}`);
    }
});
