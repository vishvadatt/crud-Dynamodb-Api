const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use(cors());
const routes = require('./routes');
// require('./table')
app.use("/api",routes);
const port = 2000

app.listen(port,() =>{
    console.log("server running on 2000");
})