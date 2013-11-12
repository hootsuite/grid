;(function($, window, document, undefined) {
  var Grid = function(element, options) {
    this.$grid = $(element);
    this.$gridItems = this.$grid.children();
    this.options = $.extend({}, this.defaults, options || {});
    this.init();
  };
  Grid.prototype = {
    defaults: {
      cols: 5,
      rows: 5,
      tileWidth: 100,
      tileHeight: 100,
      pagePadding: 50,
      fillEmptySpace: true
    },
    init: function() {
      this.$grid.data('_grid', this);
      this.$gridItems.each(this._bindMethod(function(i, item) {
        $(item).data('_gridItem', new GridItem(item, this));
      }));
      this.applySizeToItems();
      this.render();
    },
    render: function() {
      this.sortItems();
      this.positionItems2d();
      this.applySizeToContainer();
    },
    sortItems: function() {
      /**
       * Sort items based on their 1d position index
       */
      this.$gridItems.sort(function(item1, item2) {
        var gridItem1 = $(item1).data('_gridItem');
        var gridItem2 = $(item2).data('_gridItem');
        if (gridItem1.position < gridItem2.position) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    positionItems2d: function() {
      // Start with a blank empty page
      this.currentPage = new GridPage(this, 0);
      this.pages = [this.currentPage];

      var previousGridItem = null;
      this.$gridItems.each(this._bindMethod(function(i, item) {
        var gridItem = $(item).data('_gridItem');
        this.positionItem2d(gridItem, previousGridItem);
        previousGridItem = gridItem;
      }));
    },
    positionItem2d: function(gridItem, previousGridItem) {
      var startingPosition2d = [0, 0];
      if (previousGridItem) {
        // The next grid item can be placed to to right of the previous one,
        // or under if no space is available there
        startingPosition2d = $.extend([], previousGridItem.position2d);
        startingPosition2d[0] += previousGridItem.cols;
      }
      // Start new page direcly if the grid item is marked as firstInPage and
      // there are already other items positioned in the current page.
      // Otherwise check for available space in the current page and only start
      // a new one if not found
      var nextPage = false;
      if (gridItem.firstInPage && previousGridItem) {
        nextPage = true;
      } else {
        var position2d = this.currentPage.findPosition2dForItem(
                         gridItem, startingPosition2d);
        if (position2d) {
          gridItem.position2d = position2d;
        } else {
          nextPage = true;
        }
      }
      // Any item must fit in a new blank page, otherwise this will go into
      // an infinite recursion loop
      if (nextPage) {
        this.currentPage = new GridPage(this, this.pages.length);
        this.pages.push(this.currentPage);
        this.positionItem2d(gridItem, null);
      } else {
        // We need to translate the grid item 2d position into one relative to
        // the entire grid
        gridItem.apply2dPosition(this.getOffsetOfCurrentPage());
      }
    },
    applySizeToItems: function() {
      this.$gridItems.each(this._bindMethod(function(i, item) {
        var gridItem = $(item).data('_gridItem');
        gridItem.applySize();
      }));
    },
    applySizeToContainer: function() {
      var pageWidth = this.options.cols * this.options.tileWidth +
                      this.options.pagePadding;
      this.$grid.css({
        // No page padding for the first page
        width: this.pages.length * pageWidth - this.options.pagePadding,
        height: this.options.rows * this.options.tileHeight
      });
    },
    getOffsetOfCurrentPage: function() {
      var pageWidth = this.options.cols * this.options.tileWidth +
                      this.options.pagePadding;
      return this.pages.indexOf(this.currentPage) * pageWidth;
    },
    _bindMethod: function(fn) {
      /**
       * Bind prototype method to instance scope (similar to CoffeeScript's fat
       * arrow)
       */
      var that = this;
      return function() {
        return fn.apply(that, arguments);
      };
    }
  };

  var GridPage = function(grid, pageIndex) {
    /**
     * Grids are made out of multiple GridPages with NxM tiles available (as
     * many as needed to render all widgets of a grid.) GridPages contain M
     * RowLines, to simulate a 2d matrix.
     */
    this.grid = grid;
    this.pageIndex = pageIndex;
    // Create empty rows
    for (var i = 0; i < this.grid.options.rows; i++) {
      this.push(new GridRow(this.grid.options.cols));
    }
  };
  // Extend the Array prototype
  GridPage.prototype = [];
  GridPage.prototype.findPosition2dForItem = function(item,
                                                      startingPosition2d) {
    var x, y, row;
    for (y = 0; y < this.length; y++) {
      row = this[y];
      for (x = 0; x < row.length; x++) {
        if (this.itemFitsAtPosition2d(item, [x, y])) {
          this.markTilesOccupiedByItem(item, [x, y]);
          return [x, y];
        }
      }
    }
    // There isn't available space for item in this page
    return null;
  };
  GridPage.prototype.itemFitsAtPosition2d = function(item, position2d) {
    var x, y, row;
    // Make sure the item doesn't go outside the bounds of the page
    if ((position2d[0] + item.cols > this.grid.options.cols) ||
        (position2d[1] + item.rows > this.grid.options.rows)) {
      return false;
    }
    // Make sure the item doesn't overlap with an already positioned item
    var colLimit = position2d[0] + item.cols;
    var rowLimit = position2d[1] + item.rows;
    // Depending on the fillEmptySpace option, blocks can be positioned before
    // previous blocks, if the fit in an empty space left behind. When the
    // option is set to false, we don't allow items to be positioned above or
    // on the left side of already positioned previous items
    if (!this.grid.options.fillEmptySpace) {
      colLimit = this.grid.options.cols;
      rowLimit = this.grid.options.rows;
    }
    for (y = position2d[1]; y < rowLimit; y++) {
      row = this[y];
      for (x = position2d[0]; x < colLimit; x++) {
        if (row[x]) {
          return false;
        }
      }
    }
    return true;
  };
  GridPage.prototype.markTilesOccupiedByItem = function(item, position2d) {
    var x, y, row;
    for (y = position2d[1]; y < position2d[1] + item.rows; y++) {
      row = this[y];
      for (x = position2d[0]; x < position2d[0] + item.cols; x++) {
        row[x] = item;
      }
    }
  };

  var GridRow = function(cols) {
    /**
     * A GridRow is an Array subclass with N elements, representing the number
     * of tiles available inside a GridPage. Each of this element can be marked
     * with null if available to place an GridItem over it, or with the
     * reference of a GridItem object that was already placed over it
     */
    // Create empty rows
    for (var i = 0; i < cols; i++) {
      this.push(null);
    }
  };
  // Extend the Array prototype
  GridRow.prototype = [];

  var GridItem = function(element, grid) {
    /**
     * A GridItem is a representation of an item positioned inside the grid,
     * It can take up NxM grid tiles inside the grid, spanning over M GridRows
     */
    this.grid = grid;
    this.$element = $(element);
    this.cols = this.$element.data('cols') || this.grid.options.cols;
    this.rows = this.$element.data('rows') || this.grid.options.rows;
    this.position = this.$element.data('position');
    this.firstInPage = this.$element.data('first-in-page');
  };
  GridItem.prototype = {
    applySize: function() {
      this.$element.css({
        width: this.cols * this.grid.options.tileWidth,
        height: this.rows * this.grid.options.tileHeight
      });
    },
    apply2dPosition: function(pageOffset) {
      this.$element.css({
        left: this.position2d[0] * this.grid.options.tileWidth + pageOffset,
        top: this.position2d[1] * this.grid.options.tileHeight
      });
    }
  };

  $.fn.grid = function(options) {
    this.each(function() {
      new Grid(this, options);
    });
    // Maintain jQuery chain
    return this;
  };
})(jQuery, window, document);
