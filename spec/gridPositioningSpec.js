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

  describe("for grid configuration #1", function() {

    var gridFixture = fixtures.GRID1;
    var grid = new GridList(GridList.cloneItems(gridFixture.rows3), {
      rows: 3
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
      rows: 3
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
