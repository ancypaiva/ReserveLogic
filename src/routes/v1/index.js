const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const EmployeeRoute = require('./employee.route');
const settingsRoute = require('./settings.route');
const exportRoute = require('./export.route');
const crudRoute = require('./crud.Route');
const dashboardRoute = require('./dashboard.route');
const rolesRoute = require('./roles.route');
const ReportsRoute = require('./report.route');
const CmsRoute = require('./cms.route');
const MoviesRoutes = require('./movies.route');
const NotificationRoutes = require('./notifications.route');

const router = express.Router();

const appRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/crud',
    route: crudRoute,
  },
  {
    path: '/settings',
    route: settingsRoute,
  },
  {
    path: '/export',
    route: exportRoute,
  },
  {
    path: '/employee',
    route: EmployeeRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/roles',
    route: rolesRoute,
  },
  {
    path: '/report',
    route: ReportsRoute,
  },
  {
    path: '/cms',
    route: CmsRoute,
  },
  {
    path: '/movies',
    route: MoviesRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
];

appRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  router.get('/check', (_req, res) => {
    res.status(200).send({ message: 'API works' });
  });
}
module.exports = router;
