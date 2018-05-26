const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3');
const errorhandler = require('errorhandler');
const {createEmployeeTable, createTimesheetTable, createMenuTable, createMenuItemTable} = require('./migration.js');



const PORT = process.env.PORT || 4000;

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

app.use(cors());
app.use(bodyParser.json());
app.use(errorhandler());
const apiRouter = require('./server/api');
app.use('/api', apiRouter);


// Database creation
const tables = [createEmployeeTable, createTimesheetTable, createMenuTable, createMenuItemTable]
tables.forEach(function(table) {
  if (table) {
    db.run(table, err => {
      if (err) {
        next(err);
        return;
      }
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

module.exports = app;
