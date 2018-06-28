const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/music');

db = mongoose.connection;

db.on('error' ,(err) => {
	console.log('Error in connecting: ', err);
})

db.once('open' ,() => {
	console.log('Connected to mongodb');
})