const express = require("express");
const router = express.Router();
const Test = require("../models/test");
const Category = require("../models/category");
const fs = require("fs");
const upload = require("../services/testfile.service");
const response = require("../services/response.service");
const { count } = require("console");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require('../middleware/async');
const authMiddleware = require('../middleware/auth');
//Ürün Ekleme
router.post("/add", upload.array("images"), async (req, res) => {
  response(res, async () => {
    const { name, test, categories, categoryLength, aciklama } = req.body;

    const testId = uuidv4();
    let yenitest = new Test({
      _id: testId,
      name: name.toUpperCase(),
      test: test,
      aciklama: aciklama,
      categories: categories,
      isActive: true,
      imageUrls: req.files,
      createdDate: new Date(),
    });
    if (categoryLength == 1) {
      let c = await Category.findById(categories);
      c.testsCount = c.testsCount + 1;
      await Category.findByIdAndUpdate(categories, c);
    } else {
      for (i = 0; i < categoryLength; i++) {
        let c = await Category.findById(categories[i]);
        c.testsCount = c.testsCount + 1;
        await Category.findByIdAndUpdate(categories[i], c);
      }
    }

    await yenitest.save();

    res.json({ message: "Test kaydı başarıyla tamamlandı!" });
  });
});

//Ürün Silme
router.post("/removeById", async (req, res) => {
  response(res, async () => {
    const { _id } = req.body;

    const yenitest = await Test.findById(_id);
    for (const image of yenitest.imageUrls) {
      fs.unlink(image.path, () => { });
    }
    if (yenitest.categories.length == 1) {
      let c = await Category.findById(yenitest.categories);
      c.testsCount = c.testsCount - 1;
      await Category.findByIdAndUpdate(yenitest.categories, c);
    } else {
      for (i = 0; i < yenitest.categories.length; i++) {
        let c = await Category.findById(yenitest.categories[i]);
        c.testsCount = c.testsCount - 1;
        await Category.findByIdAndUpdate(yenitest.categories[i], c);
      }
    }
    await Test.findByIdAndDelete(_id);
    res.json({ message: "Ürün kaydı başarıyla silindi!" });
  });
});

//Test Listesi Getir
router.post("/", async (req, res) => {
  response(res, async () => {
    const { pageNumber, pageSize, search } = req.body;
    // console.log(pageNumber);
    let testCount = await Test.find({
      $or: [
        {
          name: { $regex: search, $options: "i" },
        },
      ],
    }).count();

    let tests = await Test.find({
      $or: [
        {
          name: { $regex: search, $options: "i" },
        },
      ],
    })
      .sort({ name: 1 })
      .populate("categories")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    let totalPageCount = Math.ceil(testCount / pageSize);
    let model = {
      datas: tests,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalPageCount: totalPageCount,
      isFirstPage: pageNumber == 1 ? true : false,
      isLastPage: totalPageCount == pageNumber ? true : false,
    };

    res.json(model);
  });
});

//Testin Aktif/Pasif Durumunu Değiştir
router.post("/changeActiveStatus", async (req, res) => {
  response(res, async () => {
    const { _id } = req.body;
    let test = await Test.findById(_id);
    test.isActive = !test.isActive;
    var result = await Test.findByIdAndUpdate(_id, test);
    //console.log(result);
    res.json({ message: "Testin durumu başarıyla değiştirildi!" });
  });
});

//Ürünü Id'ye Göre Getir
router.post("/getById", async (req, res) => {
  response(res, async () => {
    const { _id } = req.body;
    let test = await Test.findById(_id);
    res.json(test);
  });
});
router.post("/countTests", async (req, res) => {
  response(res, async () => {
    let model;
    const { categoryId } = req.body;
    // console.log(categoryId);
    await Test.estimatedDocumentCount().then((c) => {
      model = {
        count: c,
      };
    });

    res.json(model);
  });
});
router.post("/countTestByCategoryId", async (req, res) => {
  response(res, async () => {
    const { categoryId } = req.body;
    const categories = await Category.find().sort({ name: 1 });
    categories.forEach((category) => {
      let model = {
        categoryId: category,
      };
      const count = Test.find({ categories: model }).count();
    });
    res.json({ count: count, categoryId: categoryId });
  });
});

//Ürünü Güncelleme
router.post("/update", upload.array("images"), async (req, res) => {
  response(res, async () => {
    const { _id, name, test, categories, categoryLength, aciklama } = req.body;

    let eskitest = await Test.findById(_id);

    // for(const image of product.imageUrls){
    //     fs.unlink(image.path, ()=> {});
    // }
    if (eskitest.categories.length == 36) {
      let c = await Category.findById(eskitest.categories);
      c.testsCount = c.testsCount - 1;
      await Category.findByIdAndUpdate(eskitest.categories, c);
    } else {
      for (i = 0; i < eskitest.categories.length; i++) {
        let c = await Category.findById(eskitest.categories[i]);
        c.testsCount = c.testsCount - 1;
        await Category.findByIdAndUpdate(eskitest.categories[i], c);
      }
    }
    let imageUrls;
    imageUrls = [...eskitest.imageUrls, ...req.files];
    eskitest = {
      name: name.toUpperCase(),
      test: test,
      aciklama: aciklama,
      imageUrls: imageUrls,
      categories: categories,
    };
    //tek kategoriyi dizi olarak algiladigi icin 36 karakterli

    if (categoryLength == 1) {
      let c = await Category.findById(categories);
      c.testsCount = c.testsCount + 1;
      await Category.findByIdAndUpdate(categories, c);
    } else {
      for (i = 0; i < categoryLength; i++) {
        let c = await Category.findById(categories[i]);
        c.testsCount = c.testsCount + 1;
        await Category.findByIdAndUpdate(categories[i], c);
      }
    }

    await Test.findByIdAndUpdate(_id, eskitest);
    res.json({ message: "Ürün kaydı başarıyla güncellendi!" });
  });
});

//Ürün Resmi Sil
router.post("/removeImageByTestIdAndIndex", async (req, res) => {
  response(res, async () => {
    const { _id, index } = req.body;

    let mevcuttest = await Test.findById(_id);
    if (mevcuttest.imageUrls.length == 1) {
      res.status(500).json({
        message:
          "Son ürün resmini silemezsiniz! En az 1 ürün resmi bulunmak zorundadır!",
      });
    } else {
      let image = mevcuttest.imageUrls[index];
      mevcuttest.imageUrls.splice(index, 1);
      await Test.findByIdAndUpdate(_id, mevcuttest);
      fs.unlink(image.path, () => { });
      res.json({ message: "Resim başarıyla kaldırıldı!" });
    }
  });
});

//Ana sayfa için ürün listesini getir
router.post("/getAllForHomePage", async (req, res) => {
  response(res, async () => {
    const { pageNumber, pageSize, search, categoryId, dateFilter } = req.body;
    let tests;
    if (dateFilter == "0") {
      tests = await Test.find({
        isActive: true,
        categories: { $regex: categoryId, $options: "i" },
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
        ],
      })
        .sort({ name: 1 })
        .populate("categories");
    } else {
      tests = await Test.find({
        isActive: true,
        categories: { $regex: categoryId, $options: "i" },
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
        ],
      })
        .sort({ createdDate: dateFilter })
        .populate("categories");
    }

    res.json(tests);
  });
});

module.exports = router;
