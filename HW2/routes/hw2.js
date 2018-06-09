const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wow')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})

const Schema = mongoose.Schema

const stringSchema = new Schema ({
    string: String,
    length: Number
})

const hw2 = mongoose.model('hw2',stringSchema)

router.get('/', function(req, res, next) {
    hw2.find({},function(err, results){
        res.json(results)
    })
})

router.get('/:longstring', function(req, res, next) {
    let string = req.params.longstring
    let length = string.length
    hw2.find({string: string}, function(err, results){
        if (results.length) {res.json({string: string, length: length})}
        else {
            let newstring = new hw2({string: string, length: length})
            newstring.save(function(err) {
                if (err) {throw err}
                else {res.json ({string: string, length: length})}
            })
        }
    })
})

router.post('/', function(req, res, next) {
    let string = req.body.string
    let length = string.length
    if (length == 0) {res.json('Please provide a string')}
    else {
        hw2.find({string: string}, function (err, results) {
            if (results.length) {
                res.json({string: string, length: length})
            }
            else {
                let newstring = new hw2({string: string, length: length})
                newstring.save(function (err) {
                    if (err) {
                        throw err
                    }
                    else {
                        res.json({string: string, length: length})
                    }
                })
            }
        })
    }
})

router.delete('/:string',function(req, res, next){
    let string = req.params.string
    hw2.find({string: string}, function(err, results){
        if (!results.length) {res.json('String not found')}
        else {
            hw2.findOneAndRemove({string: string}, function(err) {
                if (err) {throw err}
                else {res.json ('Successfully deleted string')}
            })
        }
    })
})

module.exports = router;