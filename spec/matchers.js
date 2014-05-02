if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js');
};

var ensureItemSizes = function(items) {
  /* Set width and height of each item if it doesn't have one */
  var item,
      i;
  for (i = 0; i < items.length; i++ ) {
    item = items[i];
    item.w = item.w !== undefined ? item.w : 1;
    item.h = item.h !== undefined ? item.h : 1;
  };
};

var getMaxHeight = function(items) {
  var height = 1,
      i;
  for (i = 0; i < items.length; i++) {
    if (items[i].y + items[i].h > height) {
      height = items[i].y + items[i].h;
    }
  }
  return height;
};

exports.toEqualPositions = function(expected) {
  /**
    We don't care about the other fields, only the positions and that the
    indexes correspond (e.g. the h changes for items with auto height)
  */
 var actual = this.actual,
     _failingItem;
 this.message = function () {
    /* To avoid writing fully specified items in each test, we'll add default
     * sizes for the grid to be able to print them, allowing us to at least
     * show to the developer from where the widget starts.*/
    ensureItemSizes(expected);
    ensureItemSizes(actual);
    console.log('\n\n' +
      'Expected: ' + (new GridList(expected, {rows: getMaxHeight(expected)})) +
      'Actual: ' + (new GridList(actual, {rows: getMaxHeight(actual)})));

    // Let Jasmine know which are the items that differ
    return JSON.stringify(actual[_failingItem]) +
           " should be at position " +
           JSON.stringify(expected[_failingItem]);
  };
  for (var i = 0; i < expected.length; i++) {
    if (expected[i].x != this.actual[i].x ||
        expected[i].y != this.actual[i].y) {
      _failingItem = i;
      return false;
    }
  }
  return true;
};
