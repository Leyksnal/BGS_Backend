const mongoose = require("mongoose");

const galleryModel = mongoose.Schema(
	{
		location: {
			type: String,
		},
		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("galleries", galleryModel);
