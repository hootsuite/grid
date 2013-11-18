;(function($, window, document, undefined) {

  var DraggableGridList = function(element, options) {
    this.options = $.extend({}, this.defaults, options);
    this.$element = $(element);
    this.init();
  };

  DraggableGridList.prototype.defaults = {
    DOMDataKey: '_gridList',
    listItemSelector: '> li',
    itemWidth: 100,
    itemHeight: 80,
    zIndexOfDraggedItem: 100
  };

  DraggableGridList.prototype.init = function() {
    // Unbind any previous instance of DraggableGridList found on the targeted
    // element, and add a reference to the new one
    var previousInstance = this.$element.data(this.options.DOMDataKey);
    if (previousInstance instanceof DraggableGridList) {
      previousInstance.unbindDragEvents();
    }
    this.$element.data(this.options.DOMDataKey, this);

    // Read items and their meta data
    this.$items = this.$element.find(this.options.listItemSelector);
    this.items = this._generateItemsFromDOM();

    // Create instance of GridList (decoupled lib for handling the grid
    // positioning and sorting post-drag and dropping)
    this.gridList = new GridList(this.items, this.options.gridOptions || {});
    this.gridList.generatePositionsFromIndex();

    // Render the list for the first time
    this._applySizeToItems();
    this._applyPositionToItems();

    // Init Draggable JQuery UI plugin for each of the list items
    // http://api.jqueryui.com/draggable/
    this.$items.draggable({
      zIndex: this.options.zIndexOfDraggedItem
    });
    this.bindDragEvents();

    // Used to highlight a position an element will land on upon drop
    this.$positionHighlight = $('<li class="position-highlight"></li>').hide();
    this.$element.append(this.$positionHighlight);
  };

  DraggableGridList.prototype.bindDragEvents = function() {
    this._onDrag = this._bindMethod(this.onDrag);
    this._onStop = this._bindMethod(this.onStop);
    this.$items.on('drag', this._onDrag);
    this.$items.on('dragstop', this._onStop);
  };

  DraggableGridList.prototype.unbindDragEvents = function() {
    this.$items.off('drag', this._onDrag);
    this.$items.off('dragstop', this._onStop);
  };

  DraggableGridList.prototype.onDrag = function(event, ui) {
    var item = this._getItemByElement(ui.helper);
    this._updateDragMovement(item, ui);

    this._snapItemPositionToGrid(item);
    this._recalculateGridPositionsAfterDrag();

    this._applyPositionToItems();
    this._highlightPositionForItem(item);
  };

  DraggableGridList.prototype.onStop = function(event, ui) {
    var item = this._getItemByElement(ui.helper);
    this._resetDragMovement(item);

    this._applyPositionToItems();
    this._removePositionHighlight();
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

  DraggableGridList.prototype._generateItemsFromDOM = function() {
    /**
     * Generate the structure of items used by the GridList lib, using the DOM
     * data of the children of the targeted element. The items will have an
     * additional reference to the initial DOM element attached, in order to
     * trace back to it and re-render it once its properties are changed by the
     * GridList lib
     */
    var items = [];
    this.$items.each(function(i, item) {
      items.push({
        $element: $(item),
        cols: $(item).data('cols'),
        rows: $(item).data('rows')
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

  DraggableGridList.prototype._updateDragMovement = function(item, dragData) {
    // When this is the first movement made in a drag action---and no previous
    // position was found---the initial position is used to offset the current
    // one and detect the direction of the movement
    if (!item._position) {
      item.move = {
        x: dragData.position.left - dragData.originalPosition.left,
        y: dragData.position.top - dragData.originalPosition.top
      };
    } else {
      item.move = {
        x: dragData.position.left - item._position.left,
        y: dragData.position.top - item._position.top
      };
    }
    // Always store the previous position of item when dragging, to be able to
    // detect its last movement direction at any time during a drag action
    item._position = {
      left: dragData.position.left,
      top: dragData.position.top
    };
    item.$element.addClass('is-dragged');
  };

  DraggableGridList.prototype._resetDragMovement = function(item) {
    item.move = null;
    item.$element.removeClass('is-dragged');
  };

  DraggableGridList.prototype._snapItemPositionToGrid = function(item) {
    // TODO: Account for spaces and separators between groups
    var position = item.$element.position(),
        col = Math.round(position.left / this.options.itemWidth),
        row = Math.round(position.top / this.options.itemHeight);
    // Don't allow negative values
    item.position.col = Math.max(col, 0);
    item.position.row = Math.max(row, 0);
  };

  DraggableGridList.prototype._highlightPositionForItem = function(item) {
    this.$positionHighlight.css({
      width: item.cols * this.options.itemWidth,
      height: item.rows * this.options.itemHeight,
      left: item.position.col * this.options.itemWidth,
      top: item.position.row * this.options.itemHeight
    }).show();
  };

  DraggableGridList.prototype._removePositionHighlight = function() {
    this.$positionHighlight.hide();
  };

  DraggableGridList.prototype._recalculateGridPositionsAfterDrag = function() {
    this.gridList.generateIndexesFromPosition();
    this.gridList.generatePositionsFromIndex();

    // XXX: Figure out how should this callback work (i.e. one call for each
    // item, just the ones changed, or all at once)
    if (typeof(this.options.onPositionChange) == 'function') {
      this.options.onPositionChange.call(this, this.items);
    }
  };

  DraggableGridList.prototype._applySizeToItems = function() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].$element.css({
        width: this.items[i].cols * this.options.itemWidth,
        height: this.items[i].rows * this.options.itemHeight
      });
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
        left: this.items[i].position.col * this.options.itemWidth,
        top: this.items[i].position.row * this.options.itemHeight
      });
    }
  };

  $.fn.gridList = function(options) {
    if (!window.GridList) {
      throw new Error('GridList lib required');
    }
    this.each(function() {
      new DraggableGridList(this, options);
    });
    // Maintain jQuery chain
    return this;
  };

})(jQuery, window, document);
