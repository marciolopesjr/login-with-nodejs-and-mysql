var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ' ',
    database: 'nodelogin',
});

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.lenght > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Nome de usuário ou senha incorretos.');
            }
            response.end();
        });

    } else {
        response.send('Por favor entre com o nome de usuário e senha.');
        response.end();
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Bem vindo de volta, ' + request.session.username + '.');
    } else {
        response.send("Por favor faça login!");
    }
    response.end();
});

app.listen(3000);