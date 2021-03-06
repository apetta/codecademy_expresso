const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const createEmployeeTable = `CREATE TABLE IF NOT EXISTS Employee (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    wage INTEGER NOT NULL,
    is_current_employee INTEGER DEFAULT '1')`;

const createTimesheetTable =  `CREATE TABLE IF NOT EXISTS Timesheet (
    id INTEGER PRIMARY KEY NOT NULL,
    hours INTEGER NOT NULL,
    rate INTEGER NOT NULL,
    date INTEGER NOT NULL,
    employee_id INTEGER NOT NULL)`;


const createMenuTable =  `CREATE TABLE IF NOT EXISTS Menu (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL)`;



const createMenuItemTable = `CREATE TABLE IF NOT EXISTS MenuItem (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    inventory INTEGER NOT NULL,
    price INTEGER NOT NULL,
    menu_id INTEGER NOT NULL)`;


module.exports = {
  createEmployeeTable,
  createTimesheetTable,
  createMenuTable,
  createMenuItemTable
};
