if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js');
};

exports.toEqualPositions = function(expected) {
  /**
    We don't care about the other fields, only the positions and that the
    indexes correspond (e.g. the h changes for items with auto height)
  */
  var _expected,
      _actual;
  this.message = function () {
    var msg = JSON.stringify(_actual) +
           " should be at position " +
           JSON.stringify(_expected);

    _expected.w = (_expected.w !== 'undefined' && _expected.w) || 1;
    _expected.h = (_expected.h !== 'undefined' && _expected.h) || 1;
    _actual.w = (_actual.w !== 'undefined' && _actual.w) || 1;
    _actual.h = (_actual.h !== 'undefined' && _actual.h) || 1;

    console.log('\n\n' +
      'Expected: ' + GridList.renderItemsToString([_expected]) +
      'Actual: ' + GridList.renderItemsToString([_actual]));

    return msg;
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
