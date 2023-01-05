/* eslint-disable import/no-dynamic-require */
/**
 * Query for Report
 * @param {Object} filter - Mongo filter
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReport = async (daterange, section, fields) => {
  let filter = {};
  if (Object.keys(daterange).length) {
    const dateranges = JSON.parse(daterange.daterange);
    const fromDate = new Date(dateranges.startDate);
    const toDate = new Date(dateranges.endDate);
    filter = { createdAt: { $lte: toDate, $gte: fromDate } };
  }

  // eslint-disable-next-line global-require
  const sectionModel = require(`../models/${section}.model`);
  const users = await sectionModel.find(filter).select(fields).exec();
  return users;
};

module.exports = { queryReport };
