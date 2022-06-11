const { creatGallery, getGallery, viewGalleries, viewGallery, deleteGallery } = require("../controller/galleryController");
const upload = require("../utils/multer");

const express = require("express");
const router = express.Router();

router.route("/:id/gallery").post(upload, creatGallery);
router.route("/galleries").get(viewGalleries);
router.route("/:id/gallery").get(viewGallery);
router.route("/:gallery").get(getGallery);
router.route("/:id/:post").delete(deleteGallery);

module.exports = router;