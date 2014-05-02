// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js'),
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}

describe("Grid collisions", function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualPositions: matchers.toEqualPositions
    });
  });

  it("should move first three 1x1 widgets to right of 1xtimeline", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[3], [0, 0]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[0] = {x: 1, y: 0};
    expectedItems[1] = {x: 1, y: 1};
    expectedItems[2] = {x: 1, y: 2};
    expectedItems[3] = {x: 0, y: 0};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move last three 1x1 widgets to left of 1xtimeline", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[13], [8, 0]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[13] = {x: 8, y: 0};
    expectedItems[14] = {x: 7, y: 0};
    expectedItems[15] = {x: 7, y: 1};
    expectedItems[16] = {x: 7, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget to left of 1x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[6], [2, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[6] = {x: 2, y: 2};
    expectedItems[7] = {x: 3, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget to right of 1x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[7], [3, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[6] = {x: 2, y: 2};
    expectedItems[7] = {x: 3, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget above 1x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[10], [4, 1]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[9] = {x: 4, y: 2};
    expectedItems[10] = {x: 4, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 widget below 1x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[9], [4, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[9] = {x: 4, y: 2};
    expectedItems[10] = {x: 4, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 2x1 widget above 2x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[12], [5, 1]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[11] = {x: 5, y: 2};
    expectedItems[12] = {x: 5, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 2x1 widget below 2x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[11], [5, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[11] = {x: 5, y: 2};
    expectedItems[12] = {x: 5, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 + 1x1 widgets above 2x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[5], [2, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[5] = {x: 2, y: 2};
    expectedItems[6] = {x: 2, y: 1};
    expectedItems[7] = {x: 3, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 + 2x1 widgets above 3x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[8], [4, 1]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[8] = {x: 4, y: 1};
    expectedItems[9] = {x: 4, y: 0};
    expectedItems[11] = {x: 5, y: 0};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should move 1x1 + 1x1 widgets to right of 2x1 widget", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[12], [3, 2]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[7] = {x: 5, y: 2};
    expectedItems[10] = {x: 6, y: 2};
    expectedItems[12] = {x: 3, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should keep position when moving 1x1 widget over timeline", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[1], [1, 1]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[1] = {x: 0, y: 1};
    expect(grid.items).toEqualPositions(expectedItems);
  });

  it("should position to left when moving 1x1 widget over 2x1", function() {
    var gridFixture = fixtures.GRID2.rows3;
    var grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    grid.moveItemToPosition(grid.items[7], [3, 1]);
    helpers.sortItemsByIndex(grid.items);

    var expectedItems = GridList.cloneItems(gridFixture);
    expectedItems[5] = {x: 3, y: 1};
    expectedItems[7] = {x: 2, y: 1};
    expectedItems[9] = {x: 5, y: 1};
    expectedItems[10] = {x: 3, y: 2};
    expectedItems[11] = {x: 6, y: 1};
    expectedItems[12] = {x: 4, y: 2};
    expectedItems[13] = {x: 8, y: 0};
    expectedItems[14] = {x: 9, y: 0};
    expectedItems[15] = {x: 9, y: 1};
    expectedItems[16] = {x: 9, y: 2};
    expect(grid.items).toEqualPositions(expectedItems);
  });
});
