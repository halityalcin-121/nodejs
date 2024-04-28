const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
    testId: String,
    userId: String
});

const Basket = mongoose.model("Basket", basketSchema);
module.exports = Basket;
