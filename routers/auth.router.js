const express = require("express");
const router = express.Router();
const upload = require("../services/file.service");
const authController = require("../controllers/authcontroller");
const authProtect = require('../middleware/auth');



router.
  route("/register").
  post(authController.createUser);

router.
  route("/login").
  post(authController.loginUser);
//Memberi Id'ye Göre Getir
router.
  route("/getById").
  post(authProtect.protect, authController.getUser);
//Member Listesi Getir
router.
  route("/").
  post(authController.getUsers);

router.
  route("/update").
  post(authController.updateUser);
//Ürün Ekleme
router.
  route("/addPics").
  post(upload.array("images"), authController.addUserPics);

module.exports = router;
