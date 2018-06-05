var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));



// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/', function(req, res, next) {
    var string = (req.body).string;
    var stringLength = string.length;
    res.send('{"string":"' + string + '", "length":' + stringLength + '}');
});

//{"String":"hello","length":5}


router.get('/:string', function(req, res, next) {
    (req.params).length =((req.params).string).length
    res.json(req.params);
});

module.exports = router;
