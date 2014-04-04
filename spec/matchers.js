if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js');
};

_default_size = function(items) {
  /* Set width and height of each item if it doesn't have one */
  for (var i = 0; i < items.length; i++ ) {
    var item = items[i];
    item.w = item.w !== undefined ? item.w : 1;
    item.h = item.h !== undefined ? item.h : 1;
  };
};

exports.toEqualPositions = function(expected) {
  /**
    We don't care about the other fields, only the positions and that the
    indexes correspond (e.g. the h changes for items with auto height)
  */
 var _expected,
     _actual,
     actual = this.actual;
 this.message = function () {
    /* To avoid writing in each test fully specified items for the grid to
     * print them, we'll default sizes, allowing us to show to the developer
     * from where the widget starts atleast.*/
    // Print the grids
    _default_size(expected);
    _default_size(actual);
    console.log('\n\n' +
      'Expected: ' + (new GridList(expected, {rows: 5})) +
      'Actual: ' + (new GridList(actual, {rows: 5})));

    // Let Jasmine know which are the items that differ
    return JSON.stringify(_actual) +
           " should be at position " +
           JSON.stringify(_expected);
  };
  for (var i = 0; i < expected.length; i++) {
    if (expected[i].x != this.actual[i].x ||
        expected[i].y != this.actual[i].y) {
      _expected = expected[i];
      _actual = this.actual[i];
      return false;
    }
  }
  return true;
};
