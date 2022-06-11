const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.USER,
		pass: process.env.PASS
	},
});

const createUser = async (req, res) => {
	try {
		const { fullName, email, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const getToken = crypto.randomBytes(32).toString("hex");
		const token = jwt.sign({ getToken }, process.env.SECRET_KEY, {
			expiresIn: process.env.EXPIRES,
		});

		const user = await userModel.create({
			fullName,
			email,
			password: hashed,
		});

		const testURL = "http://localhost:3000";
		const mainURL = "https://social-frontend22.herokuapp.com";

		const mailOptions = {
			from: process.env.USER,
			to: email,
			subject: "Account Verification",
			html: `<h2>
            This is to verify your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to Continue</a>
            </h2>`,
		};

		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err.message);
			} else {
				console.log("Mail sent: ", info.response);
			}
		});

		res.status(201).json({ message: "Check you email...!" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const verifyadmin = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);

		if (user) {
			if (user.token !== "") {
				await userModel.findByIdAndUpdate(
					req.params.id,
					{
						admin: true,
						token: "",
					},
					{ new: true }
				);
				res.status(200).json({ message: "Your account is now Active" });
			} else {
				res.status(404).json({ message: "Unable to verified" });
			}
		} else {
			res.status(404).json({ message: "no user found" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const signInUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (user) {
			const checkPassword = await bcrypt.compare(password, user.password);

			if (checkPassword) {
				const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
					expiresIn: process.env.EXPIRES,
				});

				const { password, ...info } = user._doc;

				res.status(200).json({
					message: "success",
					data: { token, ...info },
				});
			} else {
				res.status(404).json({ message: "password not correct" });
			}
		} else {
			res.status(404).json({ message: "user not found" });
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await userModel.findOne({ email });

		if (user) {
			if (user.token) {
				const getToken = crypto.randomBytes(32).toString("hex");
					const token = jwt.sign({ getToken }, process.env.SECRET_KEY, {
						expiresIn: process.env.EXPIRES,
					});

					const testURL = "http://localhost:1000";

					const mailOptions = {
						from: process.env.USER,
						to: email,
						subject: "Password Reset",
						html: `<h2>
            This is to Reset your password, Please use this <a
            href="${testURL}/api/admin/token/${user._id}/${token}"
            >Link to Continue</a>
            </h2>`,
					};

				transport.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(err.message);
					} else {
						console.log("Mail sent: ", info.response);
					}
				});

				res.status(201).json({ message: "Check you email...!" });
			} else {
				res.status(404).json({ message: "cannot perform this Operation" });
			}
		} else {
			res.status(404).json({ message: "cannot find Email" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await userModel.findById(req.params.id);

		if (user) {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(password, salt);

			await userModel.findByIdAndUpdate(
				user._id,
				{
					password: hashed,
				},
				{ new: true }
			);

			res.status(201).json({ message: "password reset, you can now sign-in" });
		} else {
			res.status(404).json({ message: "error loading user" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getUsers = async (req, res) => {
	try {
		const user = await userModel.find();
		res.status(200).json({ message: "success", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
    createUser,
    verifyadmin,
    signInUser,
	getUsers,
	forgetPassword,
	resetPassword
}