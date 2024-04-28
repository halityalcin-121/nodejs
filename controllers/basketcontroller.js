const response = require("../services/response.service");
const Basket = require("../models/basket");

exports.addBasket = (req, res, next) => {
  response(res, async () => {
    const { userId, testId } = req.body;

    let basket = new Basket();
    basket.userId = userId;
    basket.testId = testId;

    let _b = await Basket.findOne({ userId: userId, testId: testId });
    if (_b != null) {
      res.json({ message: "test zaten listenizde" })
      next();
    } else {
      await basket.save();
      res.json({ message: "Test listenize eklendi!" });
      next();
    }
  });
};

exports.getCount = (req, res, next) => {
  response(res, async () => {
    const { userId } = req.body;
    const count = await Basket.find({ userId: userId }).count();
    res.json({ count: count });
    next();
  });
};

exports.getAllByUserId = (req, res, next) => {
  response(res, async () => {
    const { userId } = req.body;

    const baskets = await Basket.aggregate([

      {
        $match: { userId: userId }
      },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "tests"
        }
      }
    ]);

    res.json(baskets);
    next();
  });
};

exports.removeBasketById = (req, res, next) => {
  response(res, async () => {
    const { _id } = req.body;
    await Basket.findByIdAndDelete(_id);
    res.json({ message: "Test sepetinizden kaldırildi!" });
    next();
  });
};

