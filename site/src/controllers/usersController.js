const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");
const { User, Product } = require("../database/models");

const controller = {
	register: function (req, res) {
		return res.render("register");
	},

	processRegister: function (req, res) {
		const errors = validationResult(req);

		const user = req.body;
		if (errors.isEmpty()) {
			//Hash password
			user.password = bcrypt.hashSync(user.password, 10);
			//Delete password
			delete user.retype;
			(user.rol = 0),
				User.create(user)
					.then(function () {
						return res.redirect("login");
					})
					.catch(function (err) {
						// Print the error details
						console.log(err);
					});
		} else {
			return res
				.render("register", { errors: errors.mapped(), old: req.body })
				.catch((error) => console.log(error));
		}
	},

	login: function (req, res) {
		return res.render("login");
	},

	processLogin: function (req, res) {
		const errors = validationResult(req);
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then(function (usuarioEncontrado) {
			if (usuarioEncontrado) {
				//verify password
				if (
					bcrypt.compareSync(
						req.body.password,
						usuarioEncontrado.password
					)
				) {
					let user = usuarioEncontrado;

					req.session.user = user; //aca guardamos el usuario a loguearse
					//     // return res.send(user)

					if (req.body.remember) {
						res.cookie("email", user.email, {
							maxAge: 1000 * 60 * 60 * 24 * 30,
						});
					}
					return res.redirect("/home");
				} else {
					return res
						.render("login", {
							errors: errors.mapped(),
							old: req.body,
						})
						.catch((error) => console.log(error));
				}
			} else {
				// If user does not exist, beacuse the email is not in DB, redirect to register
				return res
					.render("register", {
						errors: errors.mapped(),
						old: req.body,
					})
					.catch((error) => console.log(error));
			}
		});
	},
	logout: function (req, res) {
		req.session.destroy();

		if (req.cookies.email) {
			res.clearCookie("email");
		}

		return res.redirect("/");
	},

	profile: function (req, res) {
		User.findByPk(req.params.id, {
			include: {
				all: true,
			},
		}).then((user) => {
			return res.render("profile", { user });
		});
	},
};
module.exports = controller;
