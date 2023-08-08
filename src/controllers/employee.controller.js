const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { employeeService } = require('../services');
const { crud } = require('../services');
const { formatResponse } = require('../utils/commonUtils');

const createEmployee = catchAsync(async (req, res) => {
  const user = await crud.createEntry(req.body, 'employee');
  res.send(formatResponse(true, 200, 'create-employee', { user }));
});

const getEmployees = catchAsync(async (req, res) => {
  const daterange = pick(req.query, ['daterange']);
  const filter = pick(req.query, ['active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy']);
  if (Object.keys(daterange).length) {
    const dateranges = JSON.parse(daterange.daterange);
    const fromDate = new Date(dateranges.startDate);
    const toDate = new Date(dateranges.endDate);
    filter.createdAt = { $lte: toDate, $gte: fromDate };
  }
  if (options.searchBy && options.searchBy.length > 0) {
    const result = await employeeService.searchEmployees(filter, options);
    res.send(formatResponse(true, 200, 'list-employees', { result }));
  } else {
    const result = await employeeService.queryEmployees(filter, options);
    res.send(formatResponse(true, 200, 'list-employees', { result }));
  }
});

const getEmployee = catchAsync(async (req, res) => {
  const user = await employeeService.getEmployeeById(req.params.employeeId);
  if (!user || user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(formatResponse(true, 200, 'get-employee', { user }));
});

const updateEmployee = catchAsync(async (req, res) => {
  const user = await employeeService.updateEmployeeById(req.params.employeeId, req.body);
  res.send(formatResponse(true, 200, 'update-employee', { user }));
});

const deleteEmployee = catchAsync(async (req, res) => {
  await employeeService.deleteEmployeeById(req.params.employeeId);
  res.send({ sucess: true, code: 200, msg: 'Deleted Sucessfully' });
});

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
