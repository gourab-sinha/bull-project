const express = require('express');
const { loadRoutes } = require('./routes/routes');
const app = express();
const PORT = 5000;

// const bodyParser= require('body-parser');
app.use(express.json());
app.use(express.urlencoded());
// const HOST = '127.0.0.1';
loadRoutes(app);
app.listen(PORT, () => console.log('App is running on port 5000'));