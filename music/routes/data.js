const router = require('express').Router();
const request = require('request');
const api = require('../config/api');
const getWeatherInfo = require('../utils/weather');
const db = require('../utils/database');
const spotify = require('../utils/spotify');


router.post('/location', (req,res) => {
	if(req.body.city){
		console.log(req.body);
		
		
		if( req.body.username ) {
			db.findUser(req.body.username)
			.then((user) => {
				if(user){
					console.log('User found', user)
					res.send({type:'status', status:'OK', user: user.username});
				}
				else{
					console.log('Creating new user');
					spotify.getAuthorizationCode(req.body.username)
					.then((url) => {
						console.log('Code can be found at: ', url)
						db.saveUser(req.body.username, req.body.city)
						.then((user) => {
							console.log('Saved user: ', user);
							res.send({type: 'link', url});
						})
					})		
					.catch((err) => {
						console.log('Error: ', err);
					})
				}
			})
			.catch((err) => {
				console.log('User not found', err);
				res.send('NOT OK');
			})
		}
		else{
			res.send('Username not present in body');						
		}

	}
	else{
		res.send('City not present in body');
	}
});

router.post('/songs', (req,res,next) => {

	// console.log(req.app.locals.user);
	db.findUser(req.body.username)
	.then((user) => {
		let location = req.body.location !== null ? req.body.location : user.location;
		return getWeatherInfo(location)
		.then((info) => {
			// console.log('From weather api: ', typeof(info));
			return {
				accessToken: user.accessToken,
				weather: info.weather[0].description
			}
		})
	})
	.then((data) => {
		spotify.searchTracks(data)
		.then((songs) => {
			console.log('Fetched songs: ', songs);
			res.send(songs);
		})
		
	})
	.catch((err) => {
		console.log('COuld not fetch songs: ', err);
	})
})

router.post('/callback', (req,res,next) => {
	console.log('Request from post: ', req.query);
	if(req.query.code){
		const auth_code = req.query.code;
		spotify.getAuthorizationToken(auth_code, req.query.state)
		.then(() => {
			console.log('Access Token granted');
			req.app.locals.user = req.query.state;
			res.send({type:'link', url:'/songs'});
			
		})
		.catch((err) => {
			console.log('Could not fetch access token: ', err);
		})
	}
})

router.get('/callback', (req,res, next) => {
	console.log('Request: ', req.query);
	if(req.query.code){
		const auth_code = req.query.code;
		spotify.getAuthorizationToken(auth_code, req.query.state)
		.then(() => {
			console.log('Access Token granted');
			req.app.locals.user = req.query.state;
			res.redirect({type:'link', url:'/songs'});
			
		})
		.catch((err) => {
			console.log('Could not fetch access token: ', err);
		})
	}
});


module.exports = router;