const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/foodMoodDB', function () {
    console.log("DB connection established!!!");
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


const Recipe = require('../models/recipeModel');
const Comment = require('../models/commentModel');

router.post('', (req, res) => {
    let newComment = req.body.newComment;
    let recipeId = req.body.recipeId

    Comment.create(newComment, (err) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            Recipe.findOneAndUpdate({ _id: recipeId }, { $push: { comments: newComment._id } }, function (err, recipes) {
                if (err) {
                    res.status(500).send("didnt deletee from model")
                }
                else {
                    Recipe.findById(recipeId).populate('comments').exec((err, recipe) => {
                        res.send(recipe)
                    })
                }
            })
        }
    })
})

module.exports = router