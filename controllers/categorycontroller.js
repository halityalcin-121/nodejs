const Category = require("../models/category");
const { v4: uuidv4 } = require("uuid");
const response = require("../services/response.service");

exports.getCategories = (req, res, next) => {
  response(res, async () => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
    next();

  });
};

exports.updateCategory = (req, res, next) => {
  response(res, async () => {
    const { _id, name, description } = req.body;
    const category = await Category.findOne({ _id: _id });

    category.name = name;
    category.description = description;
    await Category.findByIdAndUpdate(_id, category);
    res.json({ message: "Kategori kaydı başarıyla güncellendi!" });
    next();
  });

};

exports.deleteCategory = (req, res, next) => {
  response(res, async () => {
    const { _id } = req.body;
    await Category.findByIdAndDelete(_id);
    res.json({ message: "Kategori kaydı başarıyla silindi!" });
    next();
  });
};

exports.addCategory = (req, res, next) => {
  response(res, async () => {
    const { name, description } = req.body;

    const checkName = await Category.findOne({ name: name });
    if (checkName != null) {
      res.status(403).json({ message: "Bu kategori adı daha önce kullanılmış!" });
      next();

    } else {
      const category = new Category({
        _id: uuidv4(),
        name: name,
        description: description,
        testsCount: 0
      });

      await category.save();
      res.json({ message: "Kategori kaydı başarıyla tamamlandı!" });
      next();

    }
  });
};