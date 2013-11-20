var GridList = function(items, options) {
  /**
   * A GridList manages the two-dimensional position of a list of items,
   * within a virtual matrix.
   *
   * The GridList has two functions:
   *
   *  - Generate the 2d positions from the indexes of an array
   *  - Generate one-dimensional indexes from 2d grid positions
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
};

GridList.prototype.defaults = {
  rows: 5
};

GridList.prototype.generatePositionsFromIndexes = function() {
  this._resetGrid();
  // The items will be sorted based on their index within the this.items array
  // That is their "1d position"
  for (var i = 0, item, position; i < this.items.length; i++) {
    item = this.items[i];
    this._updateItemPosition(item, this._findPositionForItem(item));
  }
  return this.items;
};

GridList.prototype.generateIndexesFromPositions = function() {
  this._sortItemsByPosition();
  return this.items;
};

GridList.prototype._resetGrid = function() {
  this.grid = [];
  this.currentColumn = 0;
};

GridList.prototype._findPositionForItem = function(item) {
  /**
   * We should always have an extra column created, so we should never reach
   * the end of this method
   */
  var x, y, position;
  // Start searching for a position from the horizontal position of the
  // rightmost item from the grid
  for (x = this.currentColumn; x < this.grid.length; x++) {
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
      if (col[y]) {
        return false;
      }
    }
  }
  return true;
};

GridList.prototype._updateItemPosition = function(item, position) {
  item.x = position[0];
  item.y = position[1];
  this._markItemPositionToGrid(item);
  // New items should never be placed to the left of previous items
  this.currentColumn = Math.max(this.currentColumn, item.x);
};

GridList.prototype._markItemPositionToGrid = function(item) {
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
      col[y] = item;
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
