// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js'),
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
    var fixture = fixtures.GRID2.rows3,
        item,
        grid;

    grid = new GridList(GridList.cloneItems(fixture), {lanes: 3});
    item = grid.items[13];
    helpers.addIndexesToItems(grid.items);

    it("should move all three 1x1 widgets to right", function() {
      grid.resizeItem(item, {w: 3});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[14] = {x: 10, y: 0};
      expectedItems[15] = {x: 10, y: 1};
      expectedItems[16] = {x: 10, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });

    it("should move all three 1x1 widgets back to left", function() {
      grid.resizeItem(item, {w: 1});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[14] = {x: 8, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expectedItems[16] = {x: 8, y: 2};
      expect(grid.items).toEqualPositions(expectedItems);
    });
  });

  describe("a 2x1 widget into a 1x1 widget", function() {
    var fixture = fixtures.GRID2.rows3,
        item,
        grid;

    grid = new GridList(GridList.cloneItems(fixture), {lanes: 3});
    item = grid.items[5];
    helpers.addIndexesToItems(grid.items);

    it("should pull next widgets from its row to left", function() {
      grid.resizeItem(item, {w: 1});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 3, y: 1};
      expectedItems[11] = {x: 4, y: 1};
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expect(grid.items).toEqualPositions(expectedItems);
    });

    it("should push next widgets from its row back to right", function() {
      grid.resizeItem(item, {w: 2});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
      expectedItems[5] = {x: 2, y: 1};
      expectedItems[9] = {x: 4, y: 1};
      expectedItems[11] = {x: 5, y: 1};
      expectedItems[13] = {x: 7, y: 0};
      expectedItems[15] = {x: 8, y: 1};
      expect(grid.items).toEqualPositions(expectedItems);
    });
  });

  describe("a 2x1 widget into a 3x1 widget", function() {
    var fixture = fixtures.GRID2.rows3,
        item,
        grid;

    grid = new GridList(GridList.cloneItems(fixture), {lanes: 3});
    item = grid.items[5];
    helpers.addIndexesToItems(grid.items);

    it("should pull next widgets from its row to left", function() {
      grid.resizeItem(item, {w: 3});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
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
      grid.resizeItem(item, {w: 2});
      helpers.sortItemsByIndex(grid.items);

      var expectedItems = GridList.cloneItems(fixture);
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

  describe("a 1x1 widget to 1x2", function() {
    var grid, item1, item2;

    beforeEach(function() {
      item1 = {x: 0, y: 0, w: 1, h: 1};
      item2 = {x: 0, y: 1, w: 1, h: 1};

      grid = new GridList([item1, item2], {lanes: 2});
    });

    it("should push other items while preserving their rows", function() {
      grid.resizeItem(item1, {h: 2});

      expect(grid.items).toEqualPositions([{x: 0, y: 0}, {x: 1, y: 1}]);
    });

    it("should put the item on a new column when it doesn't fit", function() {
      grid.resizeItem(item2, {h: 2});

      expect(grid.items).toEqualPositions([{x: 0, y: 0}, {x: 1, y: 0}]);
    });
  });

  describe("a 1x1 widget to 1x2 for vertical", function() {
    var grid, item1, item2;

    beforeEach(function() {
      item1 = {w: 1, h: 2, x: 0, y: 0};
      item2 = {w: 1, h: 1, x: 1, y: 0};

      grid = new GridList([item1, item2], {
        lanes: 2,
        direction: "vertical"
      });
    });

    it("should put the item on a new row when it doesn't fit", function() {
      grid.resizeItem(item2, {w: 2});

      expect(grid.items).toEqualPositions([{x: 0, y: 0}, {x: 0, y: 2}]);
    });

    it("should push other items while preserving their rows", function() {
      grid.resizeItem(item1, {w: 2, h: 1});

      expect(grid.items).toEqualPositions([{x: 0, y: 0}, {x: 1, y: 1}]);
    });
  });

  it("should pull to left after resizing", function() {
    var item1 = {x: 0, y: 2, w: 1, h: 1},
        item2 = {x: 0, y: 3, w: 1, h: 1};

    var grid = new GridList([item1, item2], {lanes: 4});

    grid.resizeItem(item2, {w: 2, h: 2});

    expect(grid.items).toEqualPositions([{x: 0, y: 2}, {x: 0, y: 0}]);
  });
});
