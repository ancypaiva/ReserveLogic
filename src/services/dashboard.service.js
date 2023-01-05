const { User } = require('../models');

const getDashboard = async () => {
  const result = await User.aggregate([
    // User is the model of userSchema
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { $month: '$createdAt' }, // group by the month *number*, mongodb doesn't have a way to format date as month names
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: false, // remove _id
        month: {
          // set the field month as the month name representing the month number
          $arrayElemAt: [
            [
              '', // month number starts at 1, so the 0th element can be anything
              'january',
              'february',
              'march',
              'april',
              'may',
              'june',
              'july',
              'august',
              'september',
              'october',
              'november',
              'december',
            ],
            '$_id',
          ],
        },
        count: true, // keep the count
      },
    },
  ]).exec();
  return result;
};

module.exports = { getDashboard };
