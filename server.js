const express = require('express')
const app = express()
let cookieParser = require('cookie-parser');
const path = require('path')
const config = require('./config.json')
let indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')
var ip = require('ip')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(basicAuth({
    users: { 'admin': 'lixcontroller123' }, //Change here the username and password
    challenge: true,
    realm: 'Imb4T3st4pp',
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(config.port, function () {
    console.info("\x1b[33m", `LixController started on http://${ip.address()}:${config.port}`)
});

module.exports = app;