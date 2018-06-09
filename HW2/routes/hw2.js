const express = require('express')
const router = express.Router()
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

// ex from skeleton
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

//set up mongoose connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/soohyeok')

const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful. :)')
})
const Schema = mongoose.Schema

//{"String":"hello","length":5}
//setup Schema

const hw2Schema = new Schema ({
    string: String,
    length: Number
})

const hw2 = mongoose.model('hw2',hw2Schema)

router.get('/', function(req, res, next) {
    hw2.find({},function(err, results){
        res.json(results)
    })
})

//GET
router.get('/:input', function(req, res, next) {
    let input = req.params.input
    let length = input.length
    hw2.find({string: input}, function(err, results){
        //if the string exits in database
        if (results.length) {
            res.json({
                string: input,
                length: length
            })
        }
        else {
            //if the string does not exist in database
            let newInput = new hw2({
                string: input,
                length: length
            })
            newInput.save(function(err) {
                //catch & throw error
                if (err){
                    throw err
                }
                //if no error return string & length
                else {
                    res.json ({
                        string: input,
                        length: length
                    })
                }
            })
        }
    })
})

//POST
router.post('/', function(req, res, next) {
    let input = req.body.string
    let length = input.length
    //if there is no input
    if (length == 0) {res.json('Please input a String <3')}
    //if there is input
    else {
        hw2.find({string: input}, function (err, results) {
            if (results.length) {
                res.json({
                    string: input,
                    length: length
                })
            }
            else {
                let newInput = new hw2({
                    string: input,
                    length: length
                })
                newInput.save(function (err) {
                    //catch & throw error
                    if (err) {
                        throw err
                    }
                    //if no error return string & length
                    else {
                        res.json({
                            string: input,
                            length: length
                        })
                    }
                })
            }
        })
    }
})

//DELETE
router.delete('/:input',function(req, res, next){
    let input = req.params.input
    hw2.find({string: input}, function(err, results){
        //See if string is found; if not found alert the user that string is not found
        if (results.length == 0) {
            res.json('The String is Not Found :(')
        }
        else {
            //find input and delete it from db
            hw2.findOneAndRemove({string: input}, function(err) {
                //catch & throw error
                if (err) {
                    throw err
                }
                //if no error -> alert user that string has been deleted
                else {
                    res.json('Deleted the String Successfully :)')
                }
            })
        }
    })
})

module.exports = router;
