var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));



// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/', function(req, res, next) {
    var stringName = req.body.stringName;
    var stringLength = stringName.length;
    res.send('{"String":"' + stringName + '", "length":' + stringLength + '}');
});

//{"String":"hello","length":5}


router.get('/:String', function(req, res, next) {
    (req.params).length =(req.params.String).length
    res.json(req.params);
});

module.exports = router;
