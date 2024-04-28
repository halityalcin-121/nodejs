const jwt = require('jsonwebtoken');
const User = require("../models/user");
const response = require("../services/response.service");




exports.getUsers = (req, res, next) => {

  response(res, async () => {
    const { pageNumber, pageSize, search } = req.body;

    let productCount = await User.find({
      $or: [
        {
          name: { $regex: search, $options: "i" },
        },
      ],
    }).count();

    let users = await User.find({
      $or: [
        {
          name: { $regex: search, $options: "i" },
        },
      ],
    })
      .sort({ name: 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    let totalPageCount = Math.ceil(productCount / pageSize);
    let model = {
      datas: users,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalPageCount: totalPageCount,
      isFirstPage: pageNumber == 1 ? true : false,
      isLastPage: totalPageCount == pageNumber ? true : false,
    };

    res.json(model);
    next();
  });

};
exports.getUser = (req, res, next) => {
  response(res, async () => {
    const { _id } = req.body;
    let member = await User.findById(_id);
    res.json(member);
    next();
  });
};
exports.loginUser = (req, res, next) => {
  response(res, async () => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Lütfen email ve sifre giriniz!" });
      next();
    }
    let user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({ message: "sifre ya da email yanlis!" });
      next();
    } else {

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      req.user = user;
      let model = { token: token, user: user };
      res.status(201).json(model);
      // sendTokenResponse(user, 201, res);
      // next();
    }

  });


};
exports.createUser = (req, res, next) => {
  response(res, async () => {
    const user = new User(req.body);
    user._id = uuidv4(); user.createdDate = new Date(); user.isAdmin = false; user.lastActive = new Date(); user.about = "";
    user.hobbies = "";
    user.gender = "";
    user.age = 0;
    user.emailConfirmed = false;

    const checkUserEmail = await User.findOne({ email: user.email });

    if (checkUserEmail != null) {
      res.status(403)
        .json({ message: "Bu mail adresi daha önce kullanılmış!" });
      next();
    } else {
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      req.user = user;
      let model = { token: token, user: user };
      res.status(201).json(model);
      // sendTokenResponse(user, 201, res);
      // next();
    }
  });
};
exports.updateUser = (req, res, next) => {
  response(res, async () => {
    const { _id, about, hobbies } = req.body;
    const member = await User.findOne({ _id: _id });

    member.about = about;
    member.hobbies = hobbies;

    await User.findByIdAndUpdate(_id, member);
    res.json({ message: "Member kaydı başarıyla güncellendi!" });
    next();
  });
};
exports.deleteUser = (req, res, next) => {

  next();

};

exports.addUserPics = (req, res, next) => {
  response(res, async () => {
    const { _id } = req.body;
    if (req.files == 0) {
      res.json({ message: "Lütfen resim seciniz" });
      next();
    } else {
      let m = await User.findById(_id);

      let imageUrls = [...m.imageUrls, ...req.files];

      m.imageUrls = imageUrls;
      await User.findByIdAndUpdate(_id, m);

      res.status(201).json({ message: "Kayit basarili!" });
      next();
    }
  });
};

// const sendTokenResponse = (user, statusCode, res) => {
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expires: process.env.JWT_EXPIRES_IN
//   });
//   const options = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly: true
//   };
//   if (process.env.NODE_ENV === 'production') {
//     options.secure = true;
//   }

//   // res.status(statusCode).cookie('token', token, options).json({
//   //   success: true,
//   //   token
//   // });
//   let model = { token: token, user: user };
//   res.status(201).json(model)
// }
