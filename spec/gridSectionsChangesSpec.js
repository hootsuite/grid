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

  describe("For sections configuration #1", function() {

    var gridFixture = fixtures.COLUMN_GROUPS_1;
    var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
      rows: 4,
      columnsPerGroup: 3
    });

    it("should leave 11, 12 and 13 on the same page", function() {
      // This actually means that pullToLeft is done on section boundary only
      item_10 = grid._getItemByAttribute('id', 10);
      grid.moveItemToPosition(item_10, [7, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.after_dragging_10_to_the_right);
    });


  });

});