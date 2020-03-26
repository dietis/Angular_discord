const express = require('express');
const app = express();
var mysql = require('mysql');
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',
  password : 'root'
});

app.use(express.json()) // for parsing application/json

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

var delete_sql = "DROP DATABASE IF EXISTS irc_server";

connection.query(delete_sql, function (err, result) {
    if (err) throw err;
    console.log("Dropped old database");
});


var sql_create = "CREATE DATABASE IF NOT EXISTS irc_server";
console.log("Connected!");

connection.query(sql_create, function (err, result) {
    if (err) throw err;
    console.log("Database created");
});

connection.query("USE irc_server", function (err, result) {
    if (err) throw err;
    console.log("Switched to irc_server");
});

var sql = "CREATE TABLE IF NOT EXISTS irc_users (id INT AUTO_INCREMENT PRIMARY KEY, pseudo VARCHAR(255), password VARCHAR(255), token VARCHAR(255))";

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});
connection.end();


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/register', function (req, res) {
    var the_result = "";
    var name = "";
    var password = "";
    if (req.body) {
        the_result = req.body;
        name = req.body.name;
        password = req.body.password;
    }
    var reg_connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'admin',
        password : 'root'
    });
    reg_connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    var sql = "USE irc_server;";
    reg_connection.query(sql, function (err, result) {
        if (err) throw err;
    });
    var sql = "SELECT * FROM irc_users;";
    reg_connection.query(sql, function (err, result) {
        if (err) throw err;
         var found = false;
        for (one_user in result) {
            console.log(one_user);
            var found = false;
            if (one_user.name == name) {
                console.log(one_user.name + ' name was thar');
                found = true;
            }
        }
        if (found == false) {
            
        }
        //res.json(result);
    });
    reg_connection.end();
    res.json(the_result);
});

app.listen(13008, function () {
  console.log('Example app listening on port 13008!');
});