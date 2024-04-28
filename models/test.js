const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    _id: String,
    name: String,
    imageUrls: Array,
    test: String,
    aciklama: String,
    createdDate: Date,
    isActive: Boolean,
    categories: [{ type: String, ref: "Category" }]
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;