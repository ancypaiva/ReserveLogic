/* eslint-disable no-param-reassign */

const joinPaginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with joinPagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.joinPaginate = async function joinPagination(filterValue, options, joinOptions) {
    const defaultFilter = {
      isDeleted: false,
    };
    const filter = {
      ...filterValue,
      ...defaultFilter,
    };
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = {};
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        if (order === 'desc') {
          sortingCriteria[key] = -1;
        } else {
          sortingCriteria[key] = 1;
        }
      });
      sort = sortingCriteria;
    } else {
      sort = {
        createdAt: 1,
      };
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const lookUp = {
      from: joinOptions.from,
      localField: joinOptions.localField,
      foreignField: joinOptions.foreignField,
      pipeline: [{ $match: filter }],
      as: joinOptions.as,
    };
    const docsPromise = this.aggregate([
      {
        $lookup: lookUp,
      },
      {
        $facet: {
          metadata: [{ $count: 'totalResults' }],
          data: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    return Promise.all([docsPromise]).then((queryResult) => {
      const { metadata } = queryResult[0][0];
      const { totalResults } = metadata[0];
      const results = queryResult[0][0].data;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = joinPaginate;
