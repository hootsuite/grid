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

    /*
     * need better local conflict algorithm to solve this

    it("moving 10 to the right should leave 11, 12 and 13 on the same page", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      // This actually means that pullToLeft is done on section boundary only
      item_10 = grid._getItemByAttribute('id', 10);
      grid.moveItemToPosition(item_10, [7, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.after_dragging_10_to_the_right);
    });
    */

    it("moving 7 to the right should move everything one section to the right", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_7 = grid._getItemByAttribute('id', 7);
      grid.moveItemToPosition(item_7, [6, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.after_dragging_7_to_the_right);
    });

    it("dragging 7 and leaving it in place should leave everything in the same position", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_7 = grid._getItemByAttribute('id', 7);
      grid.moveItemToPosition(item_7, [4, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.initial);
    });

    it("moving 6 over 7's right half should interchange them", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_6 = grid._getItemByAttribute('id', 6);
      grid.moveItemToPosition(item_6, [5, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.after_dragging_6_over_7_second_half);
    });

    it("moving 7 to the right and back should automatically delete the empty section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_7 = grid._getItemByAttribute('id', 7);
      grid.moveItemToPosition(item_7, [6, 0]);
      grid.moveItemToPosition(item_7, [4, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.initial);
    });

    it("moving 7 to a new section and dragging 10 over 7 should push 7 to a new section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_7 = grid._getItemByAttribute('id', 7);
      item_10 = grid._getItemByAttribute('id', 10);
      grid.moveItemToPosition(item_7, [10, 0]);
      grid.moveItemToPosition(item_10, [9, 0]);
      expect(grid.items).toEqualPositionsById(gridFixture.after_moving_7_to_empty_section_and_dragging_10_over_7);
    });

  });

});