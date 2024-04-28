const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categorycontroller");

router.route("/add").
    post(categoryController.addCategory);

router.
    route("/removeById").
    post(categoryController.deleteCategory);

router.
    route("/update").
    post(categoryController.updateCategory);

router.
    route("/").
    get(categoryController.getCategories);

module.exports = router;