const express = require('express');
const cors = require('cors');
require('dotenv').config()
const indexRouter = require('./routes');
const bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', indexRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on environment: ${process.env.NODE_ENV.toUpperCase()}`)
})
