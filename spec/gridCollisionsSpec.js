// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js').GridList,
      fixtures = require('./fixtures.js');
}

describe("Grid collisions", function() {

  beforeEach(function() {
    this.addMatchers({
      // We don't care about the other fields, only the positions and that the
      // indexes correspond (e.g. the h changes for items with auto height)
      toEqualPositions: function(expected) {
        for (var i = 0; i < expected.length; i++) {
          if (expected[i].x != this.actual[i].x ||
              expected[i].y != this.actual[i].y) {
            return false;
          }
        }
        return true;
      }
    });
  });

  it("should move first three 1x1 widgets to right of 1xtimeline", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[3], [0, 0]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[0] = {x: 1, y: 0};
    expectedItems[1] = {x: 1, y: 1};
    expectedItems[2] = {x: 1, y: 2};
    expectedItems[3] = {x: 0, y: 0};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move last three 1x1 widgets to left of 1xtimeline", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[13], [8, 0]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[13] = {x: 8, y: 0};
    expectedItems[14] = {x: 7, y: 0};
    expectedItems[15] = {x: 7, y: 1};
    expectedItems[16] = {x: 7, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget to left of 1x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[6], [2, 2]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[6] = {x: 2, y: 2};
    expectedItems[7] = {x: 3, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget to right of 1x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[7], [3, 2]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[6] = {x: 2, y: 2};
    expectedItems[7] = {x: 3, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget above 1x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[10], [4, 1]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[9] = {x: 4, y: 2};
    expectedItems[10] = {x: 4, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget below 1x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[9], [4, 2]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[9] = {x: 4, y: 2};
    expectedItems[10] = {x: 4, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 2x1 widget above 2x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[12], [5, 1]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[11] = {x: 5, y: 2};
    expectedItems[12] = {x: 5, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 2x1 widget below 2x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[11], [5, 2]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[11] = {x: 5, y: 2};
    expectedItems[12] = {x: 5, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 + 1x1 widgets above 2x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[5], [2, 2]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[5] = {x: 2, y: 2};
    expectedItems[6] = {x: 2, y: 1};
    expectedItems[7] = {x: 3, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 + 2x1 widgets above 3x1 widget", function() {
    var gridFixture = fixtures.GRID2;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
    });
    grid.moveItemToPosition(grid.items[8], [4, 1]);

    var expectedItems = GridList.cloneItems(gridFixture.rows3);
    expectedItems[8] = {x: 4, y: 1};
    expectedItems[9] = {x: 4, y: 0};
    expectedItems[11] = {x: 5, y: 0};
    expect(grid.items).toEqualPositions(expectedItems);
  });
});
