const spotifyWebApi = require("spotify-web-api-node")
const api = require('./api')
const sa = new spotifyWebApi({
  clientId: api.spotify.client_id,
  clientSecret: api.spotify.client_secret,
  redirectUri: 'http://localhost:5000/callback'
});


module.exports = sa;
