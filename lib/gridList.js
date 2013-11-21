var GridList = function(items, options) {
  /**
   * A GridList manages the two-dimensional positions from a list of items,
   * within a virtual matrix.
   *
   * The GridList's main function is to convert the item positions from one
   * grid size to another, maintaining as much of their order as possible.
   *
   * The GridList's second function is to handle collisions when moving an item
   * over another.
   *
   * The positioning algorithm places items in columns. Starting from left to
   * right, going through each column top to bottom.
   *
   * The size of an item is expressed using the number of cols and rows it
   * takes up within the grid (w and h)
   *
   * The position of an item is express using the col and row position within
   * the grid (x and y)
   *
   * An item is an object of structure:
   * {
   *   w: 3, h: 1,
   *   x: 0, y: 1
   * }
   */
  this.options = options;
  for (var k in this.defaults) {
    if (!this.options.hasOwnProperty(k)) {
      this.options[k] = this.defaults[k];
    }
  }
  this.items = items;
  this.createGrid();
};

GridList.cloneItems = function(items) {
  /**
   * Clone items with a deep level of one. Items are not referenced but their
   * properties are
   */
  var _items = [],
      _item,
      i,
      k;
  for (i = 0; i < items.length; i++) {
    _item = {};
    for (k in items[i]) {
      _item[k] = items[i][k];
    }
    _items.push(_item);
  }
  return _items;
};

GridList.prototype.defaults = {
  rows: 5
};

GridList.prototype.createGrid = function(rows) {
  /**
   * If a number of rows is specified to resize the grid to, all the items will
   * be repositioned to occupy the space created by the new number of rows
   */
  if (rows) {
    this.options.rows = rows;
  }
  // We require the items to be sorted by their position even when we're just
  // creating the grid from predefined item positions
  this._sortItemsByPosition();
  this._resetGrid();
  if (rows) {
    this._generateItemPositions();
  } else {
    this._applyItemPositions();
  }
};

GridList.prototype.moveItemToPosition = function(item, position) {
  var collidingItems,
      collidingItem,
      i,
      leftOfItem,
      rightOfItem,
      aboveOfItem,
      belowOfItem;

  // Update the item position and see what collisions occur. The previous space
  // taken in the grid by this item will be cleared, and thus available for
  // colliding items to move it to
  this._updateItemPosition(item, position);
  collidingItems = this._getItemsCollidingWithItem(item);

  for (i = 0; i < collidingItems.length; i++) {
    collidingItem = collidingItems[i];

    // We use a simple algorithm for moving items around when collisions occur:
    // Move to the left if possible, otherwise push (everything) to the right
    // FIXME: Outdated comment
    leftOfItem = [item.x - collidingItem.w, collidingItem.y];
    rightOfItem = [item.x + item.w, collidingItem.y];
    aboveOfItem = [collidingItem.x, item.y - collidingItem.h];
    belowOfItem = [collidingItem.x, item.y + item.h];

    if (this._itemFitsAtPosition(collidingItem, leftOfItem)) {
      this._updateItemPosition(collidingItem, leftOfItem);
    } else if (this._itemFitsAtPosition(collidingItem, aboveOfItem)) {
      this._updateItemPosition(collidingItem, aboveOfItem);
    } else if (this._itemFitsAtPosition(collidingItem, belowOfItem)) {
      this._updateItemPosition(collidingItem, belowOfItem);
    } else if (this._itemFitsAtPosition(collidingItem, rightOfItem)) {
      this._updateItemPosition(collidingItem, rightOfItem);
    } else {
      // Moving an item to the right will probably cause a chain reaction of
      // collisions. Keep calm and recur.
      this.moveItemToPosition(collidingItem, rightOfItem);
    }
  }
};

GridList.prototype._sortItemsByPosition = function() {
  var _this = this;
  this.items.sort(function(item1, item2) {
    // Cols preced rows when it comes to position order
    if (item1.x != item2.x) {
      return item1.x - item2.x;
    }
    if (item1.y != item2.y) {
      return item1.y - item2.y;
    }
    // The items are placed on the same position
    return 0;
  });
};

GridList.prototype._resetGrid = function() {
  this.grid = [];
};

GridList.prototype._applyItemPositions = function() {
  for (var i = 0; i < this.items.length; i++) {
    this._markItemPositionToGrid(this.items[i]);
  }
};

GridList.prototype._generateItemPositions = function() {
  var currentColumn = 0;
  // The items will be sorted based on their index within the this.items array,
  // that is their "1d position"
  for (var i = 0, item, position; i < this.items.length; i++) {
    item = this.items[i];
    this._updateItemPosition(
      item, this._findPositionForItem(item, currentColumn));
    // New items should never be placed to the left of previous items
    currentColumn = Math.max(currentColumn, item.x);
  }
};

GridList.prototype._findPositionForItem = function(item, currentColumn) {
  var x, y, position;
  // Start searching for a position from the horizontal position of the
  // rightmost item from the grid
  for (x = currentColumn; x < this.grid.length; x++) {
    for (y = 0; y < this.options.rows; y++) {
      position = [x, y];
      if (this._itemFitsAtPosition(item, position)) {
        return position;
      }
    }
  }
  // If we've reached this point, we need to start a new column
  return [this.grid.length, 0];
};

GridList.prototype._itemFitsAtPosition = function(item, position) {
  /**
   * Check that an item wouldn't overlap with another one if placed at a
   * certain position within the grid
   */
  var x, y, row;
  // No coordonate can be negative
  if (position[0] < 0 || position[1] < 0) {
    return false;
  }
  // Make sure the item isn't larger than the entire grid
  if (position[1] + item.h > this.options.rows) {
    return false;
  }
  // Make sure the item doesn't overlap with an already positioned item
  for (x = position[0]; x < position[0] + item.w; x++) {
    col = this.grid[x];
    // Surely a column that hasn't even been created yet is available
    if (!col) {
      continue;
    }
    for (y = position[1]; y < position[1] + item.h; y++) {
      // Any space occupied by an item can continue to be occupied by the same
      // item
      if (col[y] && col[y] != item) {
        return false;
      }
    }
  }
  return true;
};

GridList.prototype._updateItemPosition = function(item, position) {
  if (item.x !== null && item.y !== null) {
    this._markItemPositionToGrid(item, true);
  }
  item.x = position[0];
  item.y = position[1];
  this._markItemPositionToGrid(item);
};

GridList.prototype._markItemPositionToGrid = function(item, clearItem) {
  /**
   * Mark the grid cells that are occupied by an item. This prevents items
   * from overlapping in the grid
   */
  var x, y, col;
  for (x = item.x; x < item.x + item.w; x++) {
    col = this.grid[x];
    // Create a new column on the fly if this widget goes outside the bounds
    // of the current number of columns
    if (!col) {
      col = new GridCol(this.options.rows);
      this.grid.push(col);
    }
    for (y = item.y; y < item.y + item.h; y++) {
      if (clearItem) {
        // Don't clear the cell if it's been occupied by a different widget in
        // the meantime
        if (col[y] == item) {
          col[y] = null;
        }
      } else {
        col[y] = item;
      }
    }
  }
};

GridList.prototype._getItemsCollidingWithItem = function(item) {
  var collidingItems = [];
  for (var i = 0; i < this.items.length; i++) {
    if (item != this.items[i] &&
        this._itemsAreColliding(item, this.items[i])) {
      collidingItems.push(this.items[i]);
    }
  }
  return collidingItems;
};

GridList.prototype._itemsAreColliding = function(item1, item2) {
  return !(item2.x >= item1.x + item1.w ||
           item2.x + item2.w <= item1.x ||
           item2.y >= item1.y + item1.h ||
           item2.y + item2.h <= item1.y);
};


var GridCol = function(rows) {
  for (var i = 0; i < rows; i++) {
    this.push(null);
  }
};

// Extend the Array prototype
GridCol.prototype = [];


// Enable Node module
if (typeof(require) == 'function') {
  exports.GridList = GridList;
}
