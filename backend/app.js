const express = require('express');
const helmet = require('helmet');
const bodyParser = require('express');

const app = express();
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose')
const path = require("path");
require('dotenv').config()


//*************** Connection à MongoDB ***************//
mongoose.connect(process.env.DATA_MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à mongoDB échouée !'))


//*************** CORS ***************//
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//*************** Analyse le corps des requêtes entrantes ***************//
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "same-site" }
}));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))


module.exports = app;