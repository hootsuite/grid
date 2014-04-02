exports.toEqualPositions = function(expected) {
  /**
    We don't care about the other fields, only the positions and that the
    indexes correspond (e.g. the h changes for items with auto height)
  */
 var _expected,
     _actual;
 this.message = function () {
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

exports.toEqualPositionsById = function(expected) {
  /**
    We don't care about the other fields, only the positions and that the
    indexes correspond (e.g. the h changes for items with auto height)
  */
 var _expected,
     _actual;

 this.message = function () {
    return JSON.stringify(_actual) +
           " should be at position " +
           JSON.stringify(_expected);
  };

  for (var i = 0; i < expected.length; i++) {
    for (var j = 0; j < this.actual.length; j++) {
      if (expected[i].id == this.actual[j].id &&
          (expected[i].x != this.actual[j].x ||
           expected[i].y != this.actual[j].y)) {
        _expected = expected[i];
        _actual = this.actual[j];
        return false;
      }
    }
  }
  return true;
};