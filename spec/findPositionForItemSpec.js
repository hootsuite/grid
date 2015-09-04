var GridList = require('../src/gridList.js');


describe("findPositionForItem", function() {
  describe("for an item that fits", function() {
    var item;

    beforeEach(function() {
      item = {
        w: 1,
        h: 1
      }
    });

    describe("on an empty grid", function() {
      var grid;

      beforeEach(function() {
        grid = new GridList([], {lanes: 2});
      });

      it("should place it at the top", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0})).toEqual([0, 0]);
      });

      it("should place it ignoring the start position", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 1})).toEqual([0, 0]);
      });

      it("should place it on the row I tell it to", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 1)).toEqual([0, 1]);
      });
    });

    describe("on a grid with one spot left", function() {
      var grid;

      beforeEach(function() {
        grid = new GridList([{x: 0, y: 0, w: 1, h: 1}], {lanes: 2});
      });

      it("should place it at after the rest of the elements", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0})).toEqual([0, 1]);
      });

      it("should place it on the row I tell it to", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 1)).toEqual([0, 1]);
      });

      it("should place it on a new column at the top", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 0)).toEqual([1, 0]);
      });
    });

    describe("on a full grid", function() {
      var grid;

      beforeEach(function() {
        grid = new GridList(
            [{x: 0, y: 0, w: 1, h: 1}, {x: 0, y: 1, w: 1, h: 1}],
            {lanes: 2});
      });

      it("should place it on a new column on the row I tell it to", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 1)).toEqual([1, 1]);
      });
    });
  });

  describe("for an item that doesn't fit", function() {
    var item;

    beforeEach(function() {
      item = {
        w: 1,
        h: 2
      }
    });

    describe("on an empty grid", function() {
      var grid;

      beforeEach(function() {
        grid = new GridList([], {lanes: 2});
      });

      it("should place it at the top", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0})).toEqual([0, 0]);
      });

      it("should place it according to the start position", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 1})).toEqual([0, 0]);
      });

      it("should not place it on the row I tell it to", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 1)).toEqual([0, 0]);
      });
    });

    describe("on a non-empty grid", function() {
      var grid;

      beforeEach(function() {
        grid = new GridList([{x: 0, y: 0, w: 1, h: 1}], {lanes: 2});
      });

      it("should place it on a new column at the top", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0})).toEqual([1, 0]);
      });

      it("should place it on a new column at the top", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 1})).toEqual([1, 0]);
      });

      it("should place it on a new column on the given row", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 0)).toEqual([1, 0]);
      });

      it("should place it on a new column not on the given row", function() {
        expect(grid.findPositionForItem(item, {x: 0, y: 0}, 1)).toEqual([1, 0]);
      });
    });
  });
});
