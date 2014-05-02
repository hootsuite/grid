(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.GridList = factory();
  }
}(this, function() {

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
  this._adjustHeightOfItems();
  this.generateGrid();
};

GridList.cloneItems = function(items, _items) {
  /**
   * Clone items with a deep level of one. Items are not referenced but their
   * properties are
   */
  var _item,
      i,
      k;
  if (_items === undefined) {
    _items = [];
  }
  for (i = 0; i < items.length; i++) {
    // XXX: this is good because we don't want to lose item reference, but
    // maybe we should clear their properties since some might be optional
    if (!_items[i]) {
      _items[i] = {};
    }
    for (k in items[i]) {
      _items[i][k] = items[i][k];
    }
  }
  return _items;
};

GridList.prototype = {

  defaults: {
    rows: 5
  },

  /**
   * Illustates grid as text-based table, using a number identifier for each
   * item. E.g.
   *
   *  #|  0  1  2  3  4  5  6  7  8  9 10 11 12 13
   *  --------------------------------------------
   *  0| 00 02 03 04 04 06 08 08 08 12 12 13 14 16
   *  1| 01 -- 03 05 05 07 09 10 11 11 -- 13 15 --
   *
   * Warn: Does not work if items don't have a width or height specified
   * besides their position in the grid.
   */
  toString: function() {
    var widthOfGrid = this.grid.length,
        output = '\n #|',
        border = '\n --',
        item,
        i,
        j;

    // Render the table header
    for (i = 0; i < widthOfGrid; i++) {
      output += ' ' + this._padNumber(i, ' ');
      border += '---';
    };
    output += border;

    // Render table contents row by row, as we go on the y axis
    for (i = 0; i < this.options.rows; i++) {
      output += '\n' + this._padNumber(i, ' ') + '|';
      for (j = 0; j < widthOfGrid; j++) {
        output += ' ';
        item = this.grid[j][i];
        output += item ? this._padNumber(this.items.indexOf(item), '0') : '--';
      }
    };
    output += '\n';
    return output;
  },

  generateGrid: function() {
    /**
     * Build the grid structure from scratch, with the current item positions
     */
    var i;
    this._resetGrid();
    for (i = 0; i < this.items.length; i++) {
      this._markItemPositionToGrid(this.items[i]);
    }
  },

  resizeGrid: function(rows) {
    var currentColumn = 0,
        item,
        i;

    this.options.rows = rows;
    this._adjustHeightOfItems();

    this._sortItemsByPosition();
    this._resetGrid();
    // The items will be sorted based on their index within the this.items array,
    // that is their "1d position"
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      this._updateItemPosition(
        item, this.findPositionForItem(item, {x: currentColumn, y: 0}));
      // New items should never be placed to the left of previous items
      currentColumn = Math.max(currentColumn, item.x);
    }
  },

  findPositionForItem: function(item, start, fixedRow) {
    /**
     * This method has two options for the position we want for the item:
     * - Starting from a certain row/column number and only looking for
     *   positions to its right
     * - Accepting positions for a certain row number only (use-case: items
     *   being shifted to the left/right as a result of collisions)
     */
    var x, y, position;

    // Start searching for a position from the horizontal position of the
    // rightmost item from the grid
    for (x = start.x; x < this.grid.length; x++) {
      if (fixedRow !== undefined) {
        position = [x, fixedRow];
        if (this._itemFitsAtPosition(item, position)) {
          return position;
        }
      } else {
        for (y = start.y; y < this.options.rows; y++) {
          position = [x, y];
          if (this._itemFitsAtPosition(item, position)) {
            return position;
          }
        }
      }
    }
    // If we've reached this point, we need to start a new column
    return [this.grid.length, fixedRow || 0];
  },

  moveItemToPosition: function(item, position) {
    this._updateItemPosition(item, position);
    this._resolveCollisions(item);
  },

  resizeItem: function(item, width) {
    this._updateItemSize(item, width);
    this._resolveCollisions(item);
  },

  getChangedItems: function(initialItems, idAttribute) {
    /**
     * Compare the current items against a previous snapshot and return only
     * the ones that changed their attributes in the meantime. This includes both
     * position (x, y) and size (w, h)
     *
     * Since both their position and size can change, the items need an
     * additional identifier attribute to match them with their previous state
     */
    var changedItems = [],
        i,
        item;
    for (i = 0; i < initialItems.length; i++) {
      item = this._getItemByAttribute(idAttribute, initialItems[i][idAttribute]);
      if (item.x !== initialItems[i].x ||
          item.y !== initialItems[i].y ||
          item.w !== initialItems[i].w ||
          item.h !== initialItems[i].h) {
        changedItems.push(item);
      }
    }
    return changedItems;
  },

  _sortItemsByPosition: function() {
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
  },

  _adjustHeightOfItems: function() {
    /**
     * Some items have 100% height, that height is expressed as 0. We need to
     * ensure a valid height for each of those items (always as all the number of
     * rows of the current grid configuration)
     */
    var item,
        i;
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      // This only happens the first time they are picked up
      if (item.autoHeight === undefined) {
         item.autoHeight = !item.h;
      }
      if (item.autoHeight) {
        item.h = this.options.rows;
      }
    }
  },

  _resetGrid: function() {
    this.grid = [];
  },

  _itemFitsAtPosition: function(item, position) {
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
  },

  _updateItemPosition: function(item, position) {
    if (item.x !== null && item.y !== null) {
      this._deleteItemPositionFromGrid(item);
    }
    item.x = position[0];
    item.y = position[1];
    this._markItemPositionToGrid(item);
  },

  _updateItemSize: function(item, width) {
    // TODO: Implement height change
    if (item.x !== null && item.y !== null) {
      this._deleteItemPositionFromGrid(item);
    }
    item.w = width;
    this._markItemPositionToGrid(item);
  },

  _markItemPositionToGrid: function(item) {
    /**
     * Mark the grid cells that are occupied by an item. This prevents items
     * from overlapping in the grid
     */
    var x, y;
    // Ensure that the grid has enough columns to accomodate the current item.
    this._ensureColumns(item.x + item.w);

    for (x = item.x; x < item.x + item.w; x++) {
      for (y = item.y; y < item.y + item.h; y++) {
        this.grid[x][y] = item;
      }
    }
  },

  _deleteItemPositionFromGrid: function(item) {
    var x, y;
    for (x = item.x; x < item.x + item.w; x++) {
      // It can happen to try to remove an item from a position not generated
      // in the grid, probably when loading a persisted grid of items. No need
      // to create a column to be able to remove something from it, though
      if (!this.grid[x]) {
        continue;
      }
      for (y = item.y; y < item.y + item.h; y++) {
        // Don't clear the cell if it's been occupied by a different widget in
        // the meantime (e.g. when an item has been moved over this one, and
        // thus by continuing to clear this item's previous position you would
        // cancel the first item's move, leaving it without any position even)
        if (this.grid[x][y] == item) {
          this.grid[x][y] = null;
        }
      }
    }
  },

  _ensureColumns: function(N) {
    /**
     * Ensure that the grid has at least N columns available.
     */
    var i;
    for (i = 0; i < N; i++) {
      if (!this.grid[i]) {
        this.grid.push(new GridCol(this.options.rows));
      }
    }
  },

  _getItemsCollidingWithItem: function(item) {
    var collidingItems = [];
    for (var i = 0; i < this.items.length; i++) {
      if (item != this.items[i] &&
          this._itemsAreColliding(item, this.items[i])) {
        collidingItems.push(i);
      }
    }
    return collidingItems;
  },

  _itemsAreColliding: function(item1, item2) {
    return !(item2.x >= item1.x + item1.w ||
             item2.x + item2.w <= item1.x ||
             item2.y >= item1.y + item1.h ||
             item2.y + item2.h <= item1.y);
  },

  _resolveCollisions: function(item) {
    if (!this._tryToResolveCollisionsLocally(item)) {
      this._pullItemsToLeft(item);
    }
    this._pullItemsToLeft();
  },

  _tryToResolveCollisionsLocally: function(item) {
    /**
     * Attempt to resolve the collisions after moving a an item over one or more
     * other items within the grid, by shifting the position of the colliding
     * items around the moving one. This might result in subsequent collisions,
     * in which case we will revert all position permutations. To be able to
     * revert to the initial item positions, we create a virtual grid in the
     * process
     */
    var collidingItems = this._getItemsCollidingWithItem(item);
    if (!collidingItems.length) {
      return true;
    }
    var _gridList = new GridList([], this.options),
        collidingItem,
        i,
        leftOfItem,
        rightOfItem,
        aboveOfItem,
        belowOfItem;

    GridList.cloneItems(this.items, _gridList.items);
    _gridList.generateGrid();

    for (i = 0; i < collidingItems.length; i++) {
      collidingItem = _gridList.items[collidingItems[i]];

      // We use a simple algorithm for moving items around when collisions occur:
      // In this prioritized order, we try to move a colliding item around the
      // moving one:
      // 1. to its left side
      // 2. above it
      // 3. under it
      // 4. to its right side
      leftOfItem = [item.x - collidingItem.w, collidingItem.y];
      rightOfItem = [item.x + item.w, collidingItem.y];
      aboveOfItem = [collidingItem.x, item.y - collidingItem.h];
      belowOfItem = [collidingItem.x, item.y + item.h];

      if (_gridList._itemFitsAtPosition(collidingItem, leftOfItem)) {
        _gridList._updateItemPosition(collidingItem, leftOfItem);
      } else if (_gridList._itemFitsAtPosition(collidingItem, aboveOfItem)) {
        _gridList._updateItemPosition(collidingItem, aboveOfItem);
      } else if (_gridList._itemFitsAtPosition(collidingItem, belowOfItem)) {
        _gridList._updateItemPosition(collidingItem, belowOfItem);
      } else if (_gridList._itemFitsAtPosition(collidingItem, rightOfItem)) {
        _gridList._updateItemPosition(collidingItem, rightOfItem);
      } else {
        // Collisions failed, we must use the pullItemsToLeft method to arrange
        // the other items around this item with fixed position. This is our
        // plan B for when local collision resolving fails.
        return false;
      }
    }
    // If we reached this point it means we managed to resolve the collisions
    // from one single iteration, just by moving the colliding items around. So
    // we accept this scenario and marge the brached-out grid instance into the
    // original one
    GridList.cloneItems(_gridList.items, this.items);
    this.generateGrid();
    return true;
  },

  _pullItemsToLeft: function(fixedItem) {
    /**
     * Build the grid from scratch, by using the current item positions and
     * pulling them as much to the left as possible, removing as space between
     * them as possible.
     *
     * If a "fixed item" is provided, its position will be kept intact and the
     * rest of the items will be layed around it.
     */
    var item,
        i;

    // Start a fresh grid with the fixed item already placed inside
    this._sortItemsByPosition();
    this._resetGrid();

    // Start the grid with the fixed item as the first positioned item
    if (fixedItem) {
      this._updateItemPosition(fixedItem, [fixedItem.x, fixedItem.y]);
    }
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      // The fixed item keeps its exact position
      if (fixedItem && item == fixedItem) {
        continue;
      }
      this._updateItemPosition(item, this.findPositionForItem(
        item,
        {x: this._findLeftMostPositionForItem(item), y: 0},
        item.y));
    }
  },

  _findLeftMostPositionForItem: function(item) {
    /**
     * When pulling items to the left, we need to find the leftmost position for
     * an item, with two considerations in mind:
     * - preserving its current row
     * - preserving the previous horizontal order between items
     */
    var tail = 0,
        otherItem,
        i;
    for (i = 0; i < this.grid.length; i++) {
      otherItem = this.grid[i][item.y];
      if (!otherItem) {
        continue;
      }
      if (this.items.indexOf(otherItem) < this.items.indexOf(item)) {
        tail = otherItem.x + otherItem.w;
      }
    }
    return tail;
  },

  _getItemByAttribute: function(key, value) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i][key] === value) {
        return this.items[i];
      }
    }
    return null;
  },

  _padNumber: function(nr, prefix) {
    // Currently works for 2-digit numbers (<100)
    return nr >= 10 ? nr : prefix + nr;
  }
};

var GridCol = function(rows) {
  for (var i = 0; i < rows; i++) {
    this.push(null);
  }
};

// Extend the Array prototype
GridCol.prototype = [];

// This module will have direct access to the GridList class
return GridList;

}));
