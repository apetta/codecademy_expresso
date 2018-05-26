const express = require('express');
const apiRouter = express.Router();

const employeesRouter = require('./employees');
const menusRouter = require('./menus');

// Employees Router
apiRouter.use('/employees', employeesRouter);

// Menus Router
apiRouter.use('/menus', menusRouter);

module.exports = apiRouter;
