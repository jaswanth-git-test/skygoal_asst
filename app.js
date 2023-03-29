const express = require('express');
const bodyParser = require('body-parser');

const dbService = require('./service');

const app = express();

app.use(bodyParser.json());

app.post('/signUp',dbService.createUser)

app.post('/login/',dbService.authenticateUser)

app.listen('5500',()=>console.log('server is listening in 5500'))