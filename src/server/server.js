var path = require('path');

const bodyParser = require('body-parser');
const cors  = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));


app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});