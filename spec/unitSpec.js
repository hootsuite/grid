// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js'),
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}

describe("Grid unit tests", function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualPositions: matchers.toEqualPositions,
      toEqualPositionsById: matchers.toEqualPositionsById
    });
  });

  describe("For sections configuration #1", function() {

    it("moving section 2 to the right should work correctly", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });

      grid._moveAllSectionsToTheRight(2);
      expect(grid.items).toEqualPositionsById(
                               gridFixture.after_moving_section_2_to_the_right);
    });

  });

});