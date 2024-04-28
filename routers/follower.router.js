const express = require("express");
const router = express.Router();
const followerController = require("../controllers/followerController");

router.route("/add").
    post(followerController.addFollower);
router.route("/isFollowed").
    post(followerController.isFollowed);
router.route("/removeById").
    post(followerController.removeFollowerById);

module.exports = router;