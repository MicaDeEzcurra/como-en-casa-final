function guestMiddleware(req, res, next) {
	if (req.session.user == undefined) {
		// If session does not exist, move on to register. Else, move on to index
		return next();
	} else {
		return res.redirect("/");
	}
}

module.exports = guestMiddleware;
