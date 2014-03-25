;(function($, window, document, undefined) {

  var DraggableGridList = function(element, options) {
    this.options = $.extend({}, this.defaults, options);
    this.$element = $(element);
    this._init();
    this._bindEvents();
  };

  DraggableGridList.prototype.defaults = {
    rows: 5,
    widthHeightRatio: 1
  };

  DraggableGridList.prototype.destroy = function() {
    this._unbindEvents();
  };

  DraggableGridList.prototype.resize = function(rows) {
    if (rows) {
      this.options.rows = rows;
    }
    this._createGridSnapshot();
    this.gridList.resizeGrid(this.options.rows);
    this._updateGridSnapshot();

    this.reflow();
  };

  DraggableGridList.prototype.resizeItem = function(element, size) {
    this._createGridSnapshot();
    this.gridList.resizeItem(this._getItemByElement(element), size);
    this._updateGridSnapshot();

    this.render();
  };

  DraggableGridList.prototype.reflow = function() {
    this._calculateCellSize();
    this.render();
  };

  DraggableGridList.prototype.render = function() {
    this._applySizeToItems();
    this._applyPositionToItems();
  };

  DraggableGridList.prototype._bindMethod = function(fn) {
    /**
     * Bind prototype method to instance scope (similar to CoffeeScript's fat
     * arrow)
     */
    var that = this;
    return function() {
      return fn.apply(that, arguments);
    };
  };

  DraggableGridList.prototype._init = function() {
    // Read items and their meta data. Ignore other list elements (like the
    // position highlight)
    this.$items = this.$element.children('li[data-w]');
    this.items = this._generateItemsFromDOM();
    // Used to highlight a position an element will land on upon drop
    this.$positionHighlight = this.$element.find('.position-highlight').hide();

    this._initGridList();
    this.reflow();

    // Init Draggable JQuery UI plugin for each of the list items
    // http://api.jqueryui.com/draggable/
    this.$items.draggable({
      zIndex: this.items.length,
      scroll: false
    });
    if (this.options.disableDragAndDrop)
      this.$items.draggable("destroy");
  };

  DraggableGridList.prototype._initGridList = function() {
    // Create instance of GridList (decoupled lib for handling the grid
    // positioning and sorting post-drag and dropping)
    this.gridList = new GridList(this.items, {rows: this.options.rows});
  };

  DraggableGridList.prototype._bindEvents = function() {
    this._onStart = this._bindMethod(this._onStart);
    this._onDrag = this._bindMethod(this._onDrag);
    this._onStop = this._bindMethod(this._onStop);
    this.$items.on('dragstart', this._onStart);
    this.$items.on('drag', this._onDrag);
    this.$items.on('dragstop', this._onStop);
  };

  DraggableGridList.prototype._unbindEvents = function() {
    this.$items.off('dragstart', this._onStart);
    this.$items.off('drag', this._onDrag);
    this.$items.off('dragstop', this._onStop);
  };

  DraggableGridList.prototype._onStart = function(event, ui) {
    // Create a deep copy of the items; we use them to revert the item
    // positions after each drag change, making an entire drag operation less
    // distructable
    this._createGridSnapshot();

    // Since dragging actually alters the grid, we need to establish the number
    // of cols (+1 extra) before the drag starts
    this._maxGridCols = this.gridList.grid.length;
  };

  DraggableGridList.prototype._onDrag = function(event, ui) {
    var item = this._getItemByElement(ui.helper),
        newPosition = this._snapItemPositionToGrid(item);

    if (this._dragPositionChanged(newPosition)) {
      this._previousDragPosition = newPosition;

      // Regenerate the grid with the positions from when the drag started
      GridList.cloneItems(this._items, this.items);
      this.gridList.generateGrid();

      // Since the items list is a deep copy, we need to fetch the item
      // corresponding to this drag action again
      item = this._getItemByElement(ui.helper);
      this.gridList.moveItemToPosition(item, newPosition);

      // Visually update item positions and highlight shape
      this._applyPositionToItems();
      this._highlightPositionForItem(item);
    }
  };

  DraggableGridList.prototype._onStop = function(event, ui) {
    this._updateGridSnapshot();
    this._previousDragPosition = null;

    // HACK: jQuery.draggable removes this class after the dragstop callback,
    // and we need it removed before the drop, to re-enable CSS transitions
    $(ui.helper).removeClass('ui-draggable-dragging');

    this._applyPositionToItems();
    this._removePositionHighlight();
  };

  DraggableGridList.prototype._generateItemsFromDOM = function() {
    /**
     * Generate the structure of items used by the GridList lib, using the DOM
     * data of the children of the targeted element. The items will have an
     * additional reference to the initial DOM element attached, in order to
     * trace back to it and re-render it once its properties are changed by the
     * GridList lib
     */
    var _this = this,
        items = [],
        item;
    this.$items.each(function(i, element) {
      items.push({
        $element: $(element),
        x: Number($(element).attr('data-x')),
        y: Number($(element).attr('data-y')),
        w: Number($(element).attr('data-w')),
        h: Number($(element).attr('data-h')),
        id: Number($(element).attr('data-id'))
      });
    });
    return items;
  };

  DraggableGridList.prototype._getItemByElement = function(element) {
    // XXX: this could be optimized by storing the item reference inside the
    // meta data of the DOM element
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].$element.is(element)) {
        return this.items[i];
      }
    }
  };

  DraggableGridList.prototype._calculateCellSize = function() {
    this._cellHeight = Math.floor(this.$element.height() / this.options.rows);
    this._cellWidth = this._cellHeight * this.options.widthHeightRatio;
    if (this.options.heightToFontSizeRatio) {
      this._fontSize = this._cellHeight * this.options.heightToFontSizeRatio;
    }
  };

  DraggableGridList.prototype._getItemWidth = function(item) {
    return item.w * this._cellWidth;
  };

  DraggableGridList.prototype._getItemHeight = function(item) {
    return item.h * this._cellHeight;
  };

  DraggableGridList.prototype._applySizeToItems = function() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].$element.css({
        width: this._getItemWidth(this.items[i]),
        height: this._getItemHeight(this.items[i])
      });
    }
    if (this.options.heightToFontSizeRatio) {
      this.$items.css('font-size', this._fontSize);
    }
  };

  DraggableGridList.prototype._applyPositionToItems = function() {
    // TODO: Implement group separators
    for (var i = 0; i < this.items.length; i++) {
      // Don't interfere with the positions of the dragged items
      if (this.items[i].move) {
        continue;
      }
      this.items[i].$element.css({
        left: this.items[i].x * this._cellWidth,
        top: this.items[i].y * this._cellHeight
      });
    }
    // Update the width of the entire grid container with an extra column on
    // the right for extra dragging room
    this.$element.width((this.gridList.grid.length + 1) * this._cellWidth);
  };

  DraggableGridList.prototype._dragPositionChanged = function(newPosition) {
    if (!this._previousDragPosition) {
      return true;
    }
    return (newPosition[0] != this._previousDragPosition[0] ||
            newPosition[1] != this._previousDragPosition[1]);
  };

  DraggableGridList.prototype._snapItemPositionToGrid = function(item) {
    var position = item.$element.position(),
        row,
        col;
    position[0] -= this.$element.position().left;
    col = Math.round(position.left / this._cellWidth);
    row = Math.round(position.top / this._cellHeight);
    // Keep item position within the grid and don't let the item create more
    // than one extra column
    col = Math.max(col, 0);
    row = Math.max(row, 0);
    col = Math.min(col, this._maxGridCols);
    row = Math.min(row, this.options.rows - item.h);
    return [col, row];
  };

  DraggableGridList.prototype._highlightPositionForItem = function(item) {
    this.$positionHighlight.css({
      width: this._getItemWidth(item),
      height: this._getItemHeight(item),
      left: item.x * this._cellWidth,
      top: item.y * this._cellHeight
    }).show();
    if (this.options.heightToFontSizeRatio) {
      this.$positionHighlight.css('font-size', this._fontSize);
    }
  };

  DraggableGridList.prototype._removePositionHighlight = function() {
    this.$positionHighlight.hide();
  };

  DraggableGridList.prototype._createGridSnapshot = function() {
    this._items = GridList.cloneItems(this.items);
  };

  DraggableGridList.prototype._updateGridSnapshot = function() {
    // Notify the user with the items that changed since the previous snapshot
    this._triggerOnChange();
    GridList.cloneItems(this.items, this._items);
  };

  DraggableGridList.prototype._triggerOnChange = function() {
    if (typeof(this.options.onChange) != 'function') {
      return;
    }
    this.options.onChange.call(
      this, this.gridList.getChangedItems(this._items, '$element'));
  };

  $.fn.gridList = function(options) {
    if (!window.GridList) {
      throw new Error('GridList lib required');
    }
    var instance,
        method,
        args;
    if (typeof(options) == 'string') {
      method = options;
      args =  Array.prototype.slice.call(arguments, 1);
    }
    this.each(function() {
      instance = $(this).data('_gridList');
      // The plugin call be called with no method on an existing GridList
      // instance to re-initialize it
      if (instance && !method) {
        instance.destroy();
        instance = null;
      }
      if (!instance) {
        instance = new DraggableGridList(this, options);
        $(this).data('_gridList', instance);
      }
      if (method) {
        instance[method].apply(instance, args);
      }
    });
    // Maintain jQuery chain
    return this;
  };

})(jQuery, window, document);
