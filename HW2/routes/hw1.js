const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:string', function(req, res, next) {
     (req.params).length = ((req.params).string).length;
     res.json(req.params);
});

router.post('/', function(req, res, next) {
    let string = req.body.string;
    let length = string.length;
    res.send('{"string":' + '"' + string + '", "length":' + length + '}');
})

module.exports = router;