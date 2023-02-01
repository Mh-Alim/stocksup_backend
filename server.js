
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

// ROUTE IMPORTS 
const routes = require("./Routes")
app.use("/api/v1",routes);



// ERROR MIDDLEWARE -> customErrorHandler









app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})

