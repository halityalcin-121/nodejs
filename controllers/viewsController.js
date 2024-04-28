const Datest = require('../models/test');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {

  const datests = await Datest.find();

  res.status(200).render('overview', {
    title: 'All DaTests',
    datests
  });
});

exports.getDatest = catchAsync(async (req, res) => {
  const datest = await Datest.findOne({ _id: req.params.id })
    .populate({
      path: 'categories',
      fields: 'name'
    });

  res.status(200).render('datest', {
    title: datest.name,
    datest
  });
});