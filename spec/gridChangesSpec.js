// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js'),
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}

describe("Grid changes", function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualPositions: matchers.toEqualPositions
    });
  });

  it("should return 0 items between same snapshots", function() {
    var gridFixture = fixtures.GRID2.rows3,
        grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);

    expect(grid.getChangedItems(grid.items, 'index')).toEqual([]);
  });

  it("should return 0 items after moving item to same position", function() {
    var gridFixture = fixtures.GRID2.rows3,
        grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    var snapshot = GridList.cloneItems(grid.items);
    grid.moveItemToPosition(grid.items[0], [0, 0]);

    expect(grid.getChangedItems(snapshot, 'index')).toEqual([]);
  });

  it("should return only the horizontally swapped items", function() {
    var gridFixture = fixtures.GRID2.rows3,
        grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    var initialItems = GridList.cloneItems(grid.items);

    grid.moveItemToPosition(grid.items[6], [3, 2]);
    var changedItems = grid.getChangedItems(initialItems, 'index');

    expect(changedItems.length).toEqual(2);
    expect(changedItems[0].index).toEqual(6);
    expect(changedItems[1].index).toEqual(7);
  });

  it("should return only the vertically swapped items", function() {
    var gridFixture = fixtures.GRID2.rows3,
        grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    var initialItems = GridList.cloneItems(grid.items);

    grid.moveItemToPosition(grid.items[5], [2, 2]);
    var changedItems = grid.getChangedItems(initialItems, 'index');

    expect(changedItems.length).toEqual(3);
    expect(changedItems[0].index).toEqual(5);
    expect(changedItems[1].index).toEqual(6);
    expect(changedItems[2].index).toEqual(7);
  });

  it("should return all items following resized item (to its right)", function() {
    var gridFixture = fixtures.GRID2.rows3,
        grid = new GridList(GridList.cloneItems(gridFixture), {
      rows: 3
    });
    helpers.addIndexesToItems(grid.items);
    var initialItems = GridList.cloneItems(grid.items);

    grid.resizeItem(grid.items[1], 2);
    var changedItems = grid.getChangedItems(initialItems, 'index');

    expect(changedItems.length).toEqual(15);
    // These are the only items that didn't change (from a total of 17)
    expect(changedItems.indexOf(grid.items[0])).toEqual(-1);
    expect(changedItems.indexOf(grid.items[2])).toEqual(-1);
  });
});
