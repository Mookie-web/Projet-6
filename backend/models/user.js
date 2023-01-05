// Importe Mongoose
const mongoose = require("mongoose");
// Importe le plugin unique vqlidator
const uniqueValidator = require('mongoose-unique-validator');
// Création d'un nouveau schéma de données avec 2 champs Obligatoires
const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true}
});
// Ajoute la validation unique au schéma de données
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);