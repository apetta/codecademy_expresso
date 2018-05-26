const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menusRouter;

// Menu logic

  // Menu existence check
  menusRouter.param('menuId', (req, res, next, menuId) => {
    db.get('SELECT * FROM Menu WHERE id = $id', {$id: menuId}, (error, menu) => {
      if (error) {
        next(error);
      } else if (menu) {
        req.menu = menu;
        next();
      } else {
        res.status(404).send();
      }
    });
  });

  // Get all menus
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (error, menus) => {
    if (error) {
      next(error);
    } else {
      return res.json({menus: menus});
    }
  });
});

// Create new menu
menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.status(400)
  } else {
    db.run('INSERT INTO Menu (title) VALUES ($title)', {$title: title}, function(error) {
      if (error) {
        next(error);
      } else {
        db.get('SELECT * FROM Menu WHERE id = $id', {$id: this.lastID}, (error, menu) => {
          res.status(201).json({menu: menu});
        });
      }
    });
  }
});

  // Get a menu
menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
});

  // Update a menu
menusRouter.put('/:menuId', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.status(400)
  } else {
    db.run('UPDATE Menu SET title = $title', {$title: title}, (error) => {
      if (error) {
        next(error);
      } else {
        db.get('SELECT * FROM Menu WHERE id = $id', {$id: req.params.menuId}, (error, menu) => {
          res.status(200).json({menu: menu});
        });
      }
    });
  }
});

  //Delete a menu
menusRouter.delete('/:menuId', (req, res, next) => {
  db.get('SELECT * FROM MenuItem WHERE menu_id = $menuId', {$menu_id: req.params.menuId}, (error, menuItem) => {
    if (menuItem) {
      return res.status(400).send();
    } else {
      db.run('DELETE FROM Menu WHERE id = $id', {$id: req.params.menuId}, (error) => {
        if (error) {
          next(error);
        } else {
          return res.status(204).send();
        }
      });
    }
  });
});

// Menu Item Logic
  // Menu item existence check
menusRouter.param('/:menuId/menu-items/:menuItemId', (req, res, next, menuItemId) => {
  db.get('SELECT * FROM MenuItem WHERE id = $id', {$id: menuItemId}, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.status(404).send();
    }
  });
});

  // Get a menu item
menusRouter.get('/:menuId/menu-items', (req, res, next) => {
  db.all('SELECT * FROM MenuItem WHERE menu_id = $id', {$id: req.params.menuId}, (error, menuItems) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({menuItems: menuItems});
    }
  });
});

menusRouter.post('/:menuId/menu-items', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price;

  if (!name || !inventory || !price) {
    res.status(400);
  } else {
    db.run('INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $desc, $inventory, $price, $menu_id)', {
      $name: name,
      $desc: description,
      $inventory: inventory,
      $price: price,
      $menu_id: req.params.menuId
    }, function(error) {
      if (error) {
        next(error);
      } else {
        db.get('SELECT * FROM MenuItem WHERE id = $id', {$id: this.lastID}, (error, menuItem) => {
          if (error) {
            next(error);
          } else {
            res.status(201).json({menuItem: menuItem});
          }
        });
      }
    });
  }
});

  // Update menu item
menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price;

  if (!name || !inventory || !price) {
    res.status(400);
  } else {
    db.run('UPDATE MenuItem SET name = $name, description = $desc, inventory = $inventory, price = $price, menu_id = $menu_id', {
      $name: name,
      $desc: description,
      $inventory: inventory,
      $price: price,
      $menu_id: req.params.menuId
    }, (error) => {
      if (error) {
        next(error);
      } else {
        db.get('SELECT * FROM MenuItem WHERE id = $id', {$id: req.params.menuItemId}, (error, menuItem) => {
          res.status(200).json({menuItem: menuItem});
        });
      }
    });
  }
});

  // Delete a menu item
menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {
  db.run('DELETE FROM MenuItem WHERE id = $id', {$id: req.params.menuItemId}, (error) => {
    if (error) {
      next(error);
    } else {
      res.status(204).send();
    }
  });
});
