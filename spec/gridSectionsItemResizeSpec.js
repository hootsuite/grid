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
      toEqualPositions: matchers.toEqualPositions,
      toEqualPositionsById: matchers.toEqualPositionsById
    });
  });

  describe("for sections configuration #1", function() {

    it("resizing 7 to 3x should move it to the next section and move everything else one section to the right", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      // This actually means that pullToLeft is done on section boundary only
      item_7 = grid._getItemByAttribute('id', 7);
      grid.resizeItem(item_7, 3);
      expect(grid.items).toEqualPositionsById(gridFixture.after_resizing_7_to_3x);
    });

  });

});