const rp = require('request-promise');
const api = require('../config/api');
const app = require('../app');
const db = require('../utils/database');
const sa = require('../config/spotifyApi');

const getAuthorizationCode = (state) => {
	return rp.get({
		uri: 'https://accounts.spotify.com/authorize',
		qs: {
			client_id: api.spotify.client_id,
			response_type: 'code',
			redirect_uri: 'http://localhost:5000/callback',
			state
		},
		resolveWithFullResponse: true
	})
	.then((res) => {
		return res.toJSON().request.uri.href
	})
	.catch((err) => {
		throw err;
	})
}

const getAuthorizationToken = (auth_code, user) => {
	return rp({
		method:'POST',
		uri: 'https://accounts.spotify.com/api/token',
		qs: {
			grant_type: 'authorization_code',
			code: auth_code,
			redirect_uri: 'http://localhost:5000/callback',
			client_id: api.spotify.client_id,
			client_secret: api.spotify.client_secret
		},
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			// 'Authorization': 'Basic ' + (new Buffer(api.spotify.client_id + ':' + api.spotify.client_secret).toString('base64'))
		}
	})
	.then((value) => {
		const keys = JSON.parse(value);
		console.log('Got Auth toke: ', keys);
		// console.log(Object.keys(keys));
		return db.saveTokensForUser(user, keys.access_token, keys.refresh_token)
		.then((data) => {
			console.log('Added keys to user: ', data);
		})
	})
	.catch((err) => {
		throw err;
	})
}

const refreshToken = () => {
	rp.post({
		uri: 'https://accounts.spotify.com/api/token',
		body: {
			grant_type: 'refresh_token',
			refresh_token: app.locals.refreshToken,
			client_id: api.spotify.client_id,
			client_secret: api.spotify.client_secret
		}
	})
	.then((data) => {
		console.log('Token refreshed');
		app.locals.accessToken = data.access_token;
		app.locals.expiry = data.expires_in;
	})
	.catch((err) => {
		throw err;
	})
}

const searchTracks = (data) => {
	
	sa.setAccessToken(data.accessToken);

	return sa.searchTracks(data.weather)
	 	.then((data) => {
	 		return data.body.tracks.items;
	 	})
	 	.catch((err) => {
	 		throw err;
	 	})
}

module.exports = {
	getAuthorizationCode,
	getAuthorizationToken,
	refreshToken,
	searchTracks
}