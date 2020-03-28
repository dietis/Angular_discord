const express = require('express');
const app = express();
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const http = require('http').Server(app);
var util = require('util');
var bodyParser = require('body-parser')
const formidable = require('express-formidable');

  
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',
  password : 'root'
});

/*app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());*/
app.use(formidable());
//app.use(express.json()) // for parsing application/json

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

var sql = "CREATE TABLE IF NOT EXISTS irc_channels (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))";

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created channel");
});

var room_name = "Salon de thé kouya";
var sql = "INSERT INTO irc_channels (name) VALUES ?";
var values = [[room_name]];

connection.query(sql, [values], function (err, result) {
   if (err) throw err;
});

//messages
var sql = "CREATE TABLE IF NOT EXISTS irc_messages (id INT AUTO_INCREMENT PRIMARY KEY, content VARCHAR(255), user VARCHAR(255), file VARCHAR(255))";

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created channel");
});


connection.end();


app.get('/', function (req, res) {
  res.send('Hello World!');
});

const documents = {};
var io = require('socket.io')(http);
var user_rooms = {};

//ioconnection
//io.set('origins', 'http://127.0.0.1:4200');

io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('login', function (data) {
        name = data.name;
        room = data.room;
        
        if (user_rooms[user_co] == subject) {
            [user_co] = subject;
        } else {
            socket.leave(user_rooms[user_co]);
            console.log('user left room :' + user_rooms[user_co]);
            socket.join(subject);
            [user_co] = subject;
            console.log('user joined room :' + subject);
        }
        console.log(user_rooms);
        io.on('message', function (msg) {
            console.log(msg.debug);
            io.to(subject).emit('message', msg);
        });
    });
    socket.on('disconnect', function () {
    console.log('user disconnected');
    });
});  
  
app.post('/register', function (req, res) {
    var the_result = "";
    var name = "";
    var password = "";

    if (req.fields) {
        the_result = req.fields;
        name = req.fields.name;
        password = req.fields.password;
    }

    var reg_connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'admin',
        password : 'root'
    });

    reg_connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected db!");
    });

    var sql = "USE irc_server";
    reg_connection.query(sql, function (err, result) {
    if (err) throw err;
    });

        // fields fields fields
        if (name != null && password != null) {
            var sql = "SELECT * FROM irc_users";
            reg_connection.query(sql, function (err, result) {
                if (err) throw err;
                var found = false;
        
                for (var i = 0; i < result.length; i++) {
                    var found = false;
                    if (result[i].pseudo == name) {
                        found = true;
                        console.log(result[i].pseudo + 'Aldready exist !');
                    }
                }
                if (found == false) {
                    //name	password	token
                    console.log(found + ' Status');
                    console.log(' Account added ' + name + ' | ' + password);
        
                    var sql = "INSERT INTO irc_users (pseudo, password, token) VALUES ?";
                    var values = [[name, password, '']];
        
                    reg_connection.query(sql, [values], function (err, result) {
                       if (err) throw err;
                        console.log("Number of records inserted: " + result.affectedRows);
                        reg_connection.end();
                    });
                }
                //res.json(result);
            });
            res.json(the_result);
            }
            else {
                console.log(JSON.stringify(req.body)); // I cannot see anything in the body, I only see { meta: '' }
                //console.log("Error null arguments " + name + password);
                res.json({'error':'exception'});
            }
});

app.post('/getToken', function (req, res) {
    var the_result = "";
    var name = "";
    var password = "";
    var token = "";
    var found = false;
    var id_user;

    if (req.fields) {
        the_result = req.fields;
        name = req.fields.name;
        password = req.fields.password;
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

    reg_connection.query("USE irc_server", function (err, result) {
        if (err) throw err;
        console.log("Switched to irc_server (login)");
    });

    var sql = "SELECT * FROM irc_users";
    reg_connection.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            if (result[i].pseudo == name) {
                id_user = result[i].id
                found = true;
                console.log('Got found ' + found + ' ' + result[i].pseudo);
                if (found == true) {

                    var query = 'UPDATE irc_users SET token = ? WHERE id=?';

                    token = Math.random().toString(36).substr(2);

                    reg_connection.query("UPDATE irc_users SET token='"+token+"' WHERE id='"+id_user+"'", (err, recordset) => {
                        console.log('actually querrying it withh ' + token + ' ' + id_user);
                    });

                    /*connection.query(query,[token,id_user], function (error, result, rows, fields) {
                        console.log('actually querrying it ');
                    });*/
                res.json({"token" : token});
                }
                else { 
                res.json({"error" : "on"});
                }
            }
        }
        reg_connection.end();
    });
});

app.listen(13008, function () {
    console.log('app listening on *:13008');
});
    
http.listen(3000, function () {
    console.log('http sock listening on *:3000');
});
