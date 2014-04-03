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

GridList.renderItemsToString = function(items){
    function get_position(x, y){
    	/* Returns the index of the widget in the items list that ocuppies
    	 * those coordinates. `--` means no widget occupies that possition.*/
        for (var i=0;i<items.length;i++){
            height = items[i]['h']
            if (height == 0){height = 999};

            if (items[i]['x'] <= x && ((items[i]['x'] + items[i]['w']) > x) &&
                items[i]['y'] <= y && ((items[i]['y'] + height) > y)){
                return i;
            }
        };
        return '--';
    };

    function _get_max_coord(coord){
    	/* Return the biggest value of the given coordinate (x or y).*/
        var max_coord = 0;
        for (var i=0; i<items.length;i++){
                max_coord = Math.max(items[i][coord], max_coord);
        };
        return max_coord;
    };

    // Set the grid to be shown a bit bigger to illustrate margins
    width_of_grid = _get_max_coord('x') + 1;
    height_of_grid = _get_max_coord('y') + 1;

    var output = '\n   #|';
    var border = '\n   --';
    for (var i=0; i<width_of_grid; i++){
    	if (i<=9){pos = ' ' + i;}
    	else {pos = i;};
    	output += ' ' + pos;
    	border += '---';
    };
    output += border;

    for (var i=0; i<height_of_grid; i++){
        output += '\n   ' + i + '|';
        for (var j=0; j<width_of_grid; j++){
            output += ' ';
            widget_name = get_position(j, i);
            if (widget_name <= 9){output += '0';}
            output += widget_name;
        }
    };
    output += '\n\n';
    return output;
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

  toString: function() {
	return GridList.renderItemsToString(this.items);
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

    // We don't re-arrange items inside sections
    if (this.options.columnsPerGroup)
      return;

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
      // If we have sections enabled, skip those candidates that would make the
      // item span more than one section.
      if (this.itemSpansMoreThanOneSection({x: x, w: item.w})) {
        continue;
      }

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

      // If we did not find a position for this item, check that adding it
      // at the end does not span multiple sections.
      if (this.itemSpansMoreThanOneSection({x: this.grid.length, w: item.w})) {
        x = Math.floor((this.grid.length + this.options.columnsPerGroup - 1) / this.options.columnsPerGroup) * this.options.columnsPerGroup;
        y = fixedRow || 0;
        return [x, y];
      // Otherwise, we must add a whole new section at the end of the grid
      } else {
        return [this.grid.length, fixedRow || 0];
      }
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

  itemSpansMoreThanOneSection: function(item) {
    if (!this.options.columnsPerGroup) {
      return false;
    }

    return item.x % this.options.columnsPerGroup +
           item.w > this.options.columnsPerGroup;
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

    // Make sure the item fits in the current section
    if (this.itemSpansMoreThanOneSection({x: position[0], w: item.w})) {
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

    // First try to position it from current position
    if (this.itemSpansMoreThanOneSection(item)) {
      item.x = this._findLeftMostPositionForItem(item);
    }

    // Move item to the right if it does not fit in the current section
    // anymore
    if (this.itemSpansMoreThanOneSection(item)) {
      item.x = item.x + this.options.columnsPerGroup - item.x % this.options.columnsPerGroup;
    }

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


  _resolveCollisions: function(item) {
    /**
     * Resolve all collisions after an item has been placed on the grid.
     */

    // When we have sections, the collision solving strategy is to
    // preserve the content of the sections as much as possible:
    // - first try to resolve collisions locally within the section
    // - otherwise, move all sections to the right
    if (this.options.columnsPerGroup) {
      if (!this._tryToResolveCollisionsLocally(item)) {
        var targetSection = this._getSection(item);
        this._moveAllSectionsToTheRight(targetSection, item);
      }
      this._deleteEmptySections();

    // When we don't have sections, we first try to resolve the collisions
    // locally, and then if that fails, we lay out all the items as much to
    // the left as possible, by putting the moved item in a fixed position.
    } else {
      if (!this._tryToResolveCollisionsLocally(item)) {
        this._pullItemsToLeft(item);
      }
      this._pullItemsToLeft();
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

  _getSection: function(item) {
    return Math.floor(item.x / this.options.columnsPerGroup);
  },

  _moveAllSectionsToTheRight: function(sectionStartingWith, itemToSkip) {
    /**
     * Moves all sections to the right, starting with section
     * "sectionStartingWith". Sections are numbered from left-to-right,
     * starting with the index 0.
     *
     * It can optionally skip an item, given as a parameter, so that
     * the dragged item stays the same.
     */
    var startingWithCol = this.options.columnsPerGroup * sectionStartingWith,
        itemToMove,
        i;

    this._sortItemsByPosition();
    for (i = this.items.length - 1; i >= 0; i--) {
      itemToMove = this.items[i];
      if (!itemToMove || itemToMove == itemToSkip || itemToMove.x < startingWithCol) {
        continue;
      }
      this._updateItemPosition(
        itemToMove, [itemToMove.x + this.options.columnsPerGroup, itemToMove.y]);
    }
    this._sortItemsByPosition();
  },

  _getFirstEmptySection: function() {
    /**
     * Retrieve the first empty section, or -1 if none exists.
     *
     * This is useful when determining which sections to delete.
     */
    var i, filledSections = [], maxSectionSoFar = -1;

    // Go through all the items, memorize all the sections they are placed in
    // and the maximal section number of an item.
    for (i = 0; i < this.items.length; i++) {
      var section = this._getSection(this.items[i]);
      if (filledSections.indexOf(section) == -1) {
        filledSections.push(section);
      }
      if (section > maxSectionSoFar) {
        maxSectionSoFar = section;
      }
    }

    // We use the maximal section number we have seen in order to check for all
    // such sections if at least one widget has been found in them or not.
    for (i = 0; i <= maxSectionSoFar; i++) {
      if (filledSections.indexOf(i) == -1) {
        return i;
      }
    }

    return -1;
  },

  _deleteEmptySection: function(section) {
    /**
     * Given a section number (0-based, left-to-right), deletes that empty
     * section.
     *
     * What actually happens is that the items are all moved to the left
     * with one section, starting with that section.
     *
     * Note that this is completely different from moving all items to the
     * right, where we have to go through all the items from right-to-left
     * and move them one by one. Here, we have to move them from left-to-right.
     */
      var i, itemToMove, itemInCurrentGrid,
          _gridList = new GridList([], this.options);

      GridList.cloneItems(this.items, _gridList.items);
      _gridList.generateGrid();
      _gridList._sortItemsByPosition();

      for (i = 0; i < _gridList.items.length; i++) {
        itemToMove = _gridList.items[i];
        if (this._getSection(itemToMove) > section) {
            itemInCurrentGrid = this._getItemByAttributes({x: itemToMove.x, y: itemToMove.y, w: itemToMove.w, h: itemToMove.h});
            this._updateItemPosition(itemInCurrentGrid,
                                 [itemInCurrentGrid.x - this.options.columnsPerGroup,
                                  itemInCurrentGrid.y]);
        }
      }
  },

  _deleteEmptySections: function() {
    /**
     * Deletes all empty sections that are present within the grid.
     */
    var firstEmptySection;

    firstEmptySection = this._getFirstEmptySection();
    while (firstEmptySection > -1) {
      this._deleteEmptySection(firstEmptySection);
      firstEmptySection = this._getFirstEmptySection();
    }
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
      // No colliding items means that we successfully solved all collisions
      // locally and we don't need to pull to left anymore.
      return true;
    }
    var _gridList = new GridList([], this.options),
        collidingItem,
        i, j,
        leftOfItem,
        rightOfItem,
        aboveOfItem,
        belowOfItem,
        candidates,
        solvedCollision;

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

      candidates = [leftOfItem, rightOfItem, aboveOfItem, belowOfItem];
      if (this.options.columnsPerGroup) {
        var filteredCandidates = [];
        for (j = 0; j < candidates.length; j++) {
          if (this._getSection(collidingItem) == this._getSection({x: candidates[j][0], y: candidates[j][1]})) {
            filteredCandidates.push(candidates[j]);
          }
        }
        candidates = filteredCandidates;
      }

      solvedCollision = false;
      for (j = 0; j < candidates.length && !solvedCollision; j++) {
        if (_gridList._itemFitsAtPosition(collidingItem, candidates[j])) {
          _gridList._updateItemPosition(collidingItem, candidates[j]);
          solvedCollision = true;
        }
      }

      if (!solvedCollision) {
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
        i,
        newPosition,
        startX;

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

      startX = this._findLeftMostPositionForItem(item);
      newPosition = this.findPositionForItem(item, {x: startX}, item.y);
      this._updateItemPosition(item, newPosition);
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

    // Don't go further away than the start of current section.
    // One use-case for this is in pullToLeft, where items being pulled to left
    // should not leave their current section.
    if (this.options.columnsPerGroup) {
        startOfItemPageX = item.x - (item.x % this.options.columnsPerGroup);
        tail = Math.max(tail, startOfItemPageX);
    }
    return tail;
  },

  _getItemByAttribute: function(key, value) {
    var filters = {};
    filters[key] = value;
    return this._getItemByAttributes(filters);
  },

  _getItemByAttributes: function(dict) {
    var found;

    for (var i = 0; i < this.items.length; i++) {
      found = true;
      for(var key in dict){
        if (dict.hasOwnProperty(key)) {
          if (this.items[i][key] !== dict[key]) {
            found = false;
          }
        }
      }
      if (found) {
        return this.items[i];
      }
    }
    return null;
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
