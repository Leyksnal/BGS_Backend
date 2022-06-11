const mongoose = require("mongoose");
const userModel = mongoose.Schema(
	{
		fullName: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		admin: {
			type: Boolean,
		},
		token: {
			type: String,
		},
        gallery: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "galleries",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("users", userModel);
