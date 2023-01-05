/* eslint-disable no-underscore-dangle */
const searchByFields = require('../../config/constants');
/* eslint-disable no-param-reassign */
const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function pagination(filterValue, options, searchBy = searchByFields.searchByFields) {
    const defaultFilter = {
      isDeleted: false,
    };
    const filter = {
      ...filterValue,
      ...defaultFilter,
    };
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    let countPromise = this.countDocuments(filter).exec();
    const criteria = {};
    criteria.$or = [];
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    // console.log(Object.keys(docsPromise).length);
    // const fields = ['name', 'email', 'phone'];
    if (options.searchBy) {
      searchBy.forEach((element) => {
        // const searchbale = `{${element}: { $regex: '${options.searchBy}' } }`;
        const searchbale = { [element]: { $regex: options.searchBy, $options: 'i' } };
        criteria.$or.push(searchbale);
      });
      countPromise = this.countDocuments({ ...filter, ...criteria }).exec();
      docsPromise = this.find(criteria).find(filter).sort(sort).skip(skip).limit(limit);
      // console.log(Object.keys(docsPromise).length);
    } else if (options.autocomplete) {
      const [tablefield, autocompletevalue] = options.autocomplete.split(':');
      docsPromise = this.find({ [tablefield]: { $regex: autocompletevalue } } && filter)
        .select([tablefield])
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).lean();
    }

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();
    return Promise.all([countPromise, docsPromise]).then((values) => {
      // eslint-disable-next-line prefer-const
      let [totalResults, results] = values;

      const totalPages = Math.ceil(totalResults / limit);
      results.forEach(function (res) {
        const encKey = res._id;
        delete res._id;
        res.id = encKey;
      });
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

module.exports = paginate;
