const User = require('../schema/user');

const saveUser = (user, location) => {
	let newUser = new User(
		{
			username: user, 
			location,
			accessToken: '',
			refreshToken: ''
		}
		);
	console.log('Inside saveUser');
	return new Promise((resolve, reject) => {
		newUser.save((err) => {
			if(err){
				console.log('Err: ', err);
				reject(err);
			}
			else{
				console.log('User saved');
				resolve(newUser);
			}
		})
	})
};

const findUser = (user) => {
	return new Promise((resolve, reject) => {
		User.findOne({username: user}, (err,user) => {
			if(err)
				reject(err)
			else
				resolve(user);
		})
	})
}

const saveTokensForUser = (user, accessToken, refreshToken) => {
	return new Promise((resolve, reject) => {

		User.findOne({username: user}, (err,user) => {
			if(err)
				reject(err);
			else{
				user.accessToken = accessToken;
				user.refreshToken = refreshToken;
				user.save((err, savedUser) => {
					if(err)
						reject(err);
					else
						resolve(savedUser);
				})
			}
		})
	});
}

module.exports = {
	saveUser,
	saveTokensForUser,
	findUser
};