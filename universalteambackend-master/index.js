const register = require("./Scripts/register")
const login = require("./Scripts/login")
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./Scripts/config");
const mysql = require("mysql2");
app.use(express.json());
app.use(cors());
let connection = mysql.createConnection(config.db);
require('dotenv').config();

connection.connect(function (err) {
    if (err) {
        return console.log(err);
    } else {
        console.log("successs");
    }

});

app.listen(3002, function () {
    console.log("server 3002 listening");
});

app.use(register)
app.use(login)
