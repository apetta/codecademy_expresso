const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = employeesRouter;

// Employee logic
  // Employee existence check
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  db.get('SELECT * FROM Employee WHERE id = $id', {$id: employeeId}, (error, employee) => {
    if (employee) {
      req.employee = employee;
      next();
    } else {
      res.status(404).send('Employee does not exist');
    }
  })
});

  // Get all current employees
employeesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (error, employees) => {
    res.status(200).json({employees: employees});
  });
});

  // Add new employee
employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage,
        isCurrentEmployee = (req.body.employee.isCurrentEmployee === 0) ? 0 : 1;
  if (!name || !position || !wage) {
    return res.status(400).send();
  }
  db.run('INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)', {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee
  },
    function(error) {
      db.get('SELECT * FROM Employee WHERE id = $id', {$id: this.lastID}, (error, employee) => {
        res.status(201).json({employee: employee});
      })
    })});

    // Get an employee
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee});
});

  // Update an employee
employeesRouter.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage,
        isCurrentEmployee = (req.body.employee.isCurrentEmployee === 0) ? 0 : 1;
  if (!name || !position || !wage) {
    return res.status(400).send();
  } else {
    db.run('UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE id = $id',{
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee,
      $id: req.params.employeeId
    }, (error) => {
      db.get('SELECT * FROM Employee WHERE id = $id', {$id: req.params.employeeId}, (error, employee) => {
        res.status(200).json({employee: employee});
    });
})}
});

  // Delete an employee
employeesRouter.delete('/:employeeId', (req, res, next) => {
  db.run('UPDATE Employee SET is_current_employee = 0 WHERE id = $id', {$id: req.params.employeeId}, (error) => {
    db.get('SELECT * FROM Employee WHERE id = $id', {$id: req.params.employeeId}, (error, employee) => {
      res.status(200).json({employee: employee});
    });
})});

// Employee Timesheet Logic

  // Timesheet existence check
employeesRouter.param('timesheetId', (req, res, next, id) => {
  db.get('SELECT * FROM Timesheet WHERE id = $id', {$id: id}, (error, timesheet) => {
    if (error) {
      next(error);
    } else if (timesheet) {
      next();
    } else {
      res.status(404).send('Timesheet does not exist');
    }
  })
});

  // Get all timesheets
employeesRouter.get('/:employeeId/timesheets', (req, res, next) => {
  db.all('SELECT * FROM Timesheet WHERE employee_id = $id', {$id: req.params.employeeId}, (error, timesheets) => {
    res.status(200).json({timesheets: timesheets});
  })
});

  // Post a timesheet
employeesRouter.post('/:employeeId/timesheets', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.body.timesheet.employeeId;

  if (!hours || !rate || !date || !employeeId) {
    return res.status(400).send();
  } else {
    db.run('INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employee_id)', {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employee_id: employeeId},
      function(error) {
        if (error) {
          next(error);
        } else {
          db.get('SELECT * FROM Timesheet WHERE id = $id', {$id: this.lastID}, (error, timesheet) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({timesheet: timesheet});
            }
          })
        }
      })
}});

  // Update a timesheet
employeesRouter.put('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.body.timesheet.employeeId;
  if (!hours || !rate || !date || !employeeId) {
    return res.status(400).send();
  } else {
    db.run('UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE id = $id',{
      $hours: hours,
      $rate: rate,
      $date: date,
      $employeeId: employeeId,
      $id: req.params.timesheetId,
      }, (error) => {
        if (error) {
          next(error);
        } else {
          db.get('SELECT * FROM Timesheet WHERE id = $id', {$id: req.params.timesheetId}, (error, timesheet) => {
            res.status(200).json({timesheet: timesheet});
          });
        }
      })}
  });

  // Delete a timesheet
employeesRouter.delete('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
  db.run('DELETE FROM Timesheet WHERE id = $id', {$id: req.params.timesheetId}, (error) => {
    if (error) {
      next(error);
    } else {
      res.status(204).send();
    }
  })
});
