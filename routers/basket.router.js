const express = require("express");
const router = express.Router();
const basketController = require("../controllers/basketcontroller");

router.route("/add").
    post(basketController.addBasket);

router.route("/removeById").
    post(basketController.removeBasketById);

router.route("/").
    post(basketController.getAllByUserId);

router.route("/getCount").
    post(basketController.getCount);

module.exports = router;