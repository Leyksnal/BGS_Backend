const userModel = require("../model/userModel");
const galleryModel = require("../model/galleryModel");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");

const creatGallery = async (req, res) => {
	try {
		const { location } = req.body;
		const image = await cloudinary.uploader.upload(req.file.path);

		const getUser = await userModel.findById(req.params.id);
		const postGallery = await new galleryModel({
			location,
			avatar: image.secure_url,
			avatarID: image.public_id,
		});

		postGallery.user = getUser;
		postGallery.save();

		getUser.gallery.push(mongoose.Types.ObjectId(postGallery._id));
		getUser.save();

		res.status(201).json({ message: "post created", data: galleryModel });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewGalleries = async (req, res) => {
	try {
		const post = await galleryModel.find();

		res.status(201).json({ message: "post created", data: post });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewGallery = async (req, res) => {
	try {
		const post = await userModel.findById(req.params.id).populate("gallery");

		res.status(201).json({ message: "post created", data: post });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getGallery = async (req, res) => {
	try {
		const post = await postGallery.findById(req.params.post);

		res.status(201).json({ message: "post is viewd", data: post });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteGallery = async (req, res) => {
	try {
		const postGallery = await userModel.findById(req.params.id);
		const remove = await postGallery.findByIdAndRemove(req.params.post);

		postGallery.gallery.pull(remove);
		postGallery.save();

		res.status(201).json({ message: "post deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	deleteGallery,
	creatGallery,
	viewGallery,
	viewGalleries,
	getGallery,
};