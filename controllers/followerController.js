const response = require("../services/response.service");
const Follower = require("../models/follower");


exports.addFollower = (req, res, next) => {
  response(res, async () => {
    const { userId, followerId } = req.body;

    let follower = new Follower();
    follower.userId = userId;
    follower.followerId = followerId;

    let _f = await Follower.findOne({ userId: userId, followerId: followerId });

    if (_f != null) {
      await Follower.findByIdAndDelete(_f.id);
      res.json({ message: "takipten cikildi!" });
      next();

    } else {
      await follower.save();
      res.json({ message: "takip edildi!" });
      next();

    }

  });

};
exports.isFollowed = (req, res, next) => {
  response(res, async () => {
    const { userId, followerId } = req.body;

    let follower = new Follower();
    follower.userId = userId;
    follower.followerId = followerId;

    let _f = await Follower.findOne({ userId: userId, followerId: followerId });

    if (_f != null) {
      res.json({ message: "Followed" });
      next();

    } else {
      res.json({ message: "Follow" });
      next();
    }
  });
};
exports.removeFollowerById = (req, res, next) => {
  response(res, async () => {
    const { userId, followerId } = req.body;
    await Follower.findByIdAndDelete({ userId: userId, followerId: followerId });
    res.json({ message: "takip birakildi!" });
    next();
  });
};
