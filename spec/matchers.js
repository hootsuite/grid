if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js');
};

_default_size = function(items) {
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

    _default_size(expected);
    _default_size(actual);
    console.log('\n\n' +
      'Expected: ' + (new GridList(expected, {rows: 5})) +
      'Actual: ' + (new GridList(actual, {rows: 5})));

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
