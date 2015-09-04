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

  describe('horizontal grid', function() {
    describe("for grid configuration #1", function() {

      var gridFixture = fixtures.GRID1;
      var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
        lanes: 3
      });

      it("should maintain positions for 3 rows", function() {
        expect(grid.items).toEqualPositions(gridFixture.rows3);
      });

      it("should generate correct positions for 2 rows", function() {
        grid.resizeGrid(2);
        expect(grid.items).toEqualPositions(gridFixture.rows2);
      });

      it("should generate correct positions for 4 rows", function() {
        grid.resizeGrid(4);
        expect(grid.items).toEqualPositions(gridFixture.rows4);
      });
    });

    describe("for grid configuration #2", function() {

      var gridFixture = fixtures.GRID2;
      var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
        lanes: 3
      });

      it("should maintain positions for 3 rows", function() {
        expect(grid.items).toEqualPositions(gridFixture.rows3);
      });

      it("should generate correct positions for 2 rows", function() {
        grid.resizeGrid(2);
        expect(grid.items).toEqualPositions(gridFixture.rows2);
      });

      it("should generate correct positions for 4 rows", function() {
        grid.resizeGrid(4);
        expect(grid.items).toEqualPositions(gridFixture.rows4);
      });
    });
  });

  it("should pull to left after resizing", function() {
    var grid = new GridList([
      {x: 0, y: 0, w: 1, h: 1},
      {x: 0, y: 1, w: 1, h: 1},
      {x: 1, y: 0, w: 1, h: 2},
      {x: 2, y: 0, w: 1, h: 1}
    ], {lanes: 2});

    grid.resizeGrid(3);

    expect(grid.items).toEqualPositions([
      {x: 0, y: 0, w: 1, h: 1},
      {x: 0, y: 1, w: 1, h: 1},
      {x: 1, y: 0, w: 1, h: 2},
      {x: 0, y: 2, w: 1, h: 1}
    ]);
  });
});
