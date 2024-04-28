const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Kategori ismi olmak zorunda!'],
        unique: true
    },
    description: {
        type: String
    },
    testsCount: {
        type: Number
    }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;