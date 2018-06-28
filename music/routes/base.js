const router  = require('express').Router();
const path = require('path');
const User = require('../schema/user');

router.get('*', (req,res) => {
	// res.sendFile(path.join(__dirname,'../','views','index.html'));
	res.render('index')
})

module.exports = router;