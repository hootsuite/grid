// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js'),
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}

describe("Grid positioning", function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualPositions: matchers.toEqualPositions
    });
  });

  describe("For sections configuration #2", function() {

    var gridFixture = fixtures.COLUMN_GROUPS_2;
    var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
      rows: 4
    });

    it("should leave 10, 11 and 12 on the 4th section", function() {
      expect(grid.items).toEqualPositions(gridFixture.initial);
    });


  });

});