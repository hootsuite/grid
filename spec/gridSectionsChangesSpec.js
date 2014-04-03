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

  describe("For sections configuration #1", function() {

    it("moving 10 to the right should leave 11, 12 and 13 on the same page", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      // This actually means that pullToLeft is done on section boundary only
      item_10 = grid.items[10];
      grid.moveItemToPosition(item_10, [7, 0]);
      expect(grid.items).toEqualPositions(gridFixture.after_dragging_10_to_the_right);
    });

    it("moving 9 to the right should move everything one section to the right", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_9 = grid.items[9];
      grid.moveItemToPosition(item_9, [6, 0]);
      expect(grid.items).toEqualPositions(gridFixture.after_dragging_9_to_the_right);
    });

    it("dragging 9 and leaving it in place should leave everything in the same position", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_9 = grid.items[9];
      grid.moveItemToPosition(item_9, [4, 0]);
      expect(grid.items).toEqualPositions(gridFixture.initial);
    });

    it("moving 6 over 9's right half should interchange them", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_6 = grid.items[6];
      grid.moveItemToPosition(item_6, [5, 0]);
      expect(grid.items).toEqualPositions(gridFixture.after_dragging_6_over_9_second_half);
    });

    it("moving 9 to the right and back should automatically delete the empty section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_9 = grid.items[9];
      grid.moveItemToPosition(item_9, [6, 0]);
      grid.moveItemToPosition(item_9, [4, 0]);
      expect(grid.items).toEqualPositions(gridFixture.initial);
    });

    it("moving 9 to a new section and dragging 10 over 9 should push 9 to a new section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_9 = grid.items[9];
      item_10 = grid.items[10];
      grid.moveItemToPosition(item_9, [10, 0]);
      grid.moveItemToPosition(item_10, [9, 0]);
      expect(grid.items).toEqualPositions(gridFixture.after_moving_9_to_empty_section_and_dragging_10_over_9);
    });

    it("moving 6 over 3 should push 3 to the next section (even though they have same x,y,w,h)", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_6 = grid.items[6];
      grid.moveItemToPosition(item_6, [2, 0]);
      expect(grid.items).toEqualPositions(gridFixture.after_dragging_6_over_3);
    });

    it("moving 6 over 7 should push 7 to the right within the same section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_6 = grid.items[6];
      grid.moveItemToPosition(item_6, [3, 1]);
      expect(grid.items).toEqualPositions(gridFixture.after_dragging_6_over_7);
    });

    it("moving 3 over 4 should interchange them instead of creating a new section", function() {
      var gridFixture = fixtures.COLUMN_GROUPS_1;
      var grid = new GridList(GridList.cloneItems(gridFixture.initial), {
        rows: 4,
        columnsPerGroup: 3
      });
      item_3 = grid.items[3];
      grid.moveItemToPosition(item_6, [2, 1]);
      expect(grid.items).toEqualPositions(gridFixture.after_moving_3_over_4);
    });

  });

});
