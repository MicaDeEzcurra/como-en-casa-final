// App middleware
// Middleware will check if data from sessions is stored in variable locals
const { User } = require("../database/models");

function log(req, res, next) {
	//session
	res.locals.user = false;
	if (req.session.user) {
		// I want all my views to have user session data, so I created variable locals (comes with package session), and stored user session data in it.
		// Variable locals allows me to acces this data from views
		res.locals.user = req.session.user;
		return next();

		//cookies
	} else if (req.cookies.email) {
		User.findOne({
			where: {
				email: req.cookies.email,
			},
		})
			.then(function (user) {
				if (user) {
					delete user.password;
					req.session.user = user;
					res.locals.user = user;
				}
				return next();
			})
			.catch(function (err) {
				// print error details
				console.log(err);
			});
	} else {
		return next();
	}
}

module.exports = log;
