const express = require('express');
const app = express();
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const http = require('http').Server(app);
const vocal_http = require('http').Server(app);
var util = require('util');
var bodyParser = require('body-parser')
const formidable = require('express-formidable');
var cleanser = require('profanity-cleanser');
cleanser.setLocale(); 

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

var room_name = ["Salon de thé kouya",
                 "Salon des matrixé",
                 "Salon des Uchiwas",
                 "Salon des mangeurs de bonne bouffe"];
room_name.forEach(function (item, index) {
    var sql = "INSERT INTO irc_channels (name) VALUES ?";
    var values = [[item]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("inserting channel "+ item);
    });
});

var vocal_room = ["Salon de la voix ;)"];


//messages
var sql = "CREATE TABLE IF NOT EXISTS irc_messages (id INT AUTO_INCREMENT PRIMARY KEY, content VARCHAR(255), user VARCHAR(255), file longtext)";

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created channel");
});


connection.end();


app.get('/', function (req, res) {
  res.send('Hello World!');
});

var io = require('socket.io')(http);
var vocal_io = require('socket.io')(vocal_http);

//ioconnection
//io.set('origins', 'http://127.0.0.1:4200');

var connected = false;
var name = "";
io.on('connection', function (socket) {
    var sock = mysql.createConnection({
        host     : 'localhost',
        user     : 'admin',
        password : 'root'
    });

    sock.connect(function(err) {
        if (err) throw err;
        console.log("Connected db!");
    });

    var sql = "USE irc_server";
    sock.query(sql, function (err, result) {
    if (err) throw err;
    });
    var sql = "SELECT * FROM irc_channels";
    sock.query(sql, function (err, chans) {
        if (err) throw err;
        var sql = "SELECT * FROM irc_users";
        sock.query(sql, function (err, users) {
            if (err) throw err;
            var sql = "SELECT * FROM irc_messages";
            sock.query(sql, function (err, messages) {
                if (err) throw err;
                console.log("so users are {"+ JSON.stringify(users) +"} have access to these chans {"+ JSON.stringify(chans) + "} and there are the messages {" + JSON.stringify(messages) + "}");
                
                console.log('user connected');
                var name;
                var room;
                var subject;
            
                socket.on('first_log', function (data) {
                    name = data.name;
                    room = data.subject;
            
                    if (room_name[room] !== null) {
                        console.log(data.oldroom , room);
                        if (data.oldroom != 100) {
                            console.log(data.oldroom , room);
                            hello = 1;
                            socket.nsp.to(room_name[data.oldroom]).emit('message', {msg: 'Moi Le grand ' + data.name + ' Je vous dis au revoir et je vous laisse au ' + room_name[room]});
                            socket.leave(room_name[data.oldroom]);
                        }
                        socket.leave(room_name[room]);
                        socket.join(room_name[room]);
                        //room_name[room] = subject;
                        //socket.to(room_name[room]).emit('message', { name: name, msg: 'Je suis nouveau', from: room_name[room]});
                        console.log("logged user " + name)
                        socket.nsp.to(room_name[room]).emit('message', {msg: 'Je suis nouveau mon nom est ' + data.name + ' Je viens au ' + room_name[room], connected: 1});
                    }
                    else {
                        console.log("Bad room error cote front " + room);
                    }
                    console.log(room_name[room] + " Xsubject=" + data.subject);
                });

                socket.on('first_log_vocal', function (data) {

                });

                socket.on('message', function (data) {
                    console.log("ther");
                    var output = data.msg;

                    if (output != null)
                    output = cleanser.replace(data.msg);
                    console.log("message to channel (" + room_name[room]+") from "+ name + " msg is : " + output);
                    var sql = "INSERT INTO irc_messages (content, user, file) VALUES ?";
                    var filedate = data.filedata;

                    if (filedate != null) {
                    filedate = cleanser.replace(data.filedata);
                        var values = [[output, name, filedate]];
                    }
                    else {
                        var values = [[output, name, '']];
                    }
                    sock.query(sql, [values], function (err, result) {
                        if (err) throw err;
                    });
                    socket.nsp.to(room_name[room]).emit('message', {msg: output, name : data.name, filedata : data.filedata });
                });

                socket.on('disconnect', function () {
                    socket.leave(room_name[room]);
                    socket.to(room_name[room]).emit('message', {msg: 'Je me suis déconnecté :' + name + ' J\'étais au ' + room_name[room]});
                    console.log(name + ' left room :' + room_name[room]);
                    console.log(name + ' disconnected');
                });
            });
        });
    });
});

app.get('/channels', function (req, res) {
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
    var sql = "SELECT * FROM irc_channels";
    reg_connection.query(sql, function (err, result) {
            if (err) throw err;
        var array = [];
        for (var i = 0; i < result.length; i++) {
            array[i] = result[i].name;
        }
        var obj = JSON.stringify(array);
        res.json(obj);
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

vocal_http.listen(3001, function () {
    console.log('http sock listening on *:3000');
});
