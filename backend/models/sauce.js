const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(name) {
                return name.trim().length > 0;
            },
            message: 'Name ne doit pas seulement avoir des espaces'
        }
    },
    manufacturer: {
        type: String,
        required: true,
        validate: {
            validator: function(manufacturer) {
                return manufacturer.trim().length > 0;
            },
            message: 'Manufacturer ne doit pas seulement avoir des espaces'
        }
    },
    description: {
        type: String,
        required: true,
        validate: {
            validator: function(description) {
                return description.trim().length > 0;
            },
            message: 'Description ne doit pas seulement avoir des espaces'
        }
    },
    mainPepper: {
        type: String,
        required: true,
        validate: {
            validator: function(mainPepper) {
                return mainPepper.trim().length > 0;
            },
            message: 'Main pepper ne doit pas seulement avoir des espaces'
        }
    },
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true, min:1,max:10},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]},
});

module.exports = mongoose.model('Sauce', sauceSchema);
