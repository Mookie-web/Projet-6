const Sauce = require("../models/sauce");
const fs = require('fs')



exports.createSauce = (req, res, next) => {

    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    /** @var _userId */
    delete sauceObjet._userId;

    const sauce = new Sauce({
        ...sauceObjet,
        userId: req.auth.userId,
        likes: 0,
        dislikes: 0,
        usersDisliked: [],
        usersLiked:[],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({message: "Sauce enregistré !"}))
        .catch((error) => res.status(400).json({error}));
};


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then(
            (sauce) => {
                res.status(200).json(sauce);
            }
        )
        .catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: " Non authorised"});
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet modifié!'}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: " Non authorised"});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).json({message: 'Sauce supprimé !'})
                        })
                        .catch(error => res.status(401).json({error}));
                });
            }
            })
        .catch(error => {
            res.status(500).json({error});
        });
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ message: "Sauce non trouvée" });
            }

            const likeType = req.body.like;
            const userId = req.body.userId;

            switch (likeType) {
                // Like
                case 1:
                    if (sauce.usersDisliked.includes(userId)){
                        return res.status(400).json({message:'Vous avez déjà disliké cette sauce !'});
                    }
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.usersLiked.push(userId);
                        ++sauce.likes;
                    }
                    break;
                // Annulation
                case 0:
                    if (sauce.usersDisliked.includes(userId)) {
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                        --sauce.dislikes;
                    } else if (sauce.usersLiked.includes(userId)) {
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        --sauce.likes;
                    }
                    break;
                // Dislike
                case -1:
                    if (sauce.usersLiked.includes(userId)){
                        return res.status(400).json({message:'Vous avez déjà liké cette sauce'})
                    }
                    if (!sauce.usersDisliked.includes(userId)) {
                        sauce.usersDisliked.push(userId);
                        ++sauce.dislikes;
                    }
                    break;
                default:
                    return res.status(401).json({ message: "La valeur de like est fausse" });
            }

            sauce
                .save()
                .then(() => res.status(200).json({ message: "Avis enregistré !" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};





