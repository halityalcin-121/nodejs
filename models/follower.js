const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
    userId: String,
    followerId:String
});

const Follower = mongoose.model("Follower",followerSchema);
module.exports = Follower;
