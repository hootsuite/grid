// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js').GridList,
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}

describe("Grid item resizing", function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualPositions: matchers.toEqualPositions
    });
  });

  describe("a 1xtimeline to 3xtimeline", function() {
    var gridFixture = fixtures.GRID2,
        grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
          rows: 3
        }),
        item = grid.items[13];

    it("should move all three 1x1 widgets to right", function() {
      item.w = 3;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[14] = {x: 10, y: 0};
      expectedItems[15] = {x: 10, y: 1};
      expectedItems[16] = {x: 10, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });

    it("should move all three 1x1 widgets back to left", function() {
      item.w = 1;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[14] = {x: 8, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expectedItems[16] = {x: 8, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });
  });

  describe("a 2x1 widget into a 1x1 widget", function() {
    var gridFixture = fixtures.GRID2,
        grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
          rows: 3
        }),
        item = grid.items[5];

    it("should pull next widgets from its row to left", function() {
      item.w = 1;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 3, y: 1};
      expectedItems[11] = {x: 4, y: 1};
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expect(grid.items).toEqualPositions(expectedItems);
    });

    it("should push next widgets from its row back to right", function() {
      item.w = 2;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 4, y: 1};
      expectedItems[11] = {x: 5, y: 1};
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expect(grid.items).toEqualPositions(expectedItems);
    });
  });

  describe("a 2x1 widget into a 3x1 widget", function() {
    var gridFixture = fixtures.GRID2,
        grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
          rows: 3
        }),
        item = grid.items[5];

    it("should pull next widgets from its row to left", function() {
      item.w = 3;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 5, y: 1};
      expectedItems[11] = {x: 6, y: 1};
      expectedItems[13] = {x: 8, y: 0};
      expectedItems[14] = {x: 9, y: 0};
      expectedItems[15] = {x: 9, y: 1};
      expectedItems[16] = {x: 9, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });

    it("should push next widgets from its row back to right", function() {
      item.w = 2;
      grid.moveItemToPosition(item, [item.x, item.y]);

      var expectedItems = GridList.cloneItems(gridFixture.rows3);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 4, y: 1};
      expectedItems[11] = {x: 5, y: 1};
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[14] = {x: 8, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expectedItems[16] = {x: 8, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });
  });
});
