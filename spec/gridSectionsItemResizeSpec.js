// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js'),
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

  describe("for sections configuration #1", function() {

    it("resizing 9 to 3x should move it to the next section and move everything else one section to the right", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      // This actually means that pullToLeft is done on section boundary only
      item_9 = grid.items[9];
      grid.resizeItem(item_9, 3);
      expect(grid.items).toEqualPositions(gridFixture.after_resizing_9_to_3x);
    });

    it("move 7 to right and resizing 7 to 3x should move it back left in the same section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      // This actually means that pullToLeft is done on section boundary only
      item_7 = grid.items[7];
      grid.moveItemToPosition(item_7, [4, 1]);
      grid.resizeItem(item_7, 3);
      expect(grid.items).toEqualPositions(gridFixture.after_resizing_7_to_3x);
    });


  });

});
