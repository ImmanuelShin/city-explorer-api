require('dotenv').config();

const PORT = process.env.PORT || 3000;

const cors = require('cors');
const express = require('express');
const app = express();

app.get('/', (request, response) => {

});

app.use(cors());

class List {

}

app.listen(PORT, () => {

});