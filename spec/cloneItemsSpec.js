// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../src/gridList.js'),
      fixtures = require('./fixtures.js');
      matchers = require('./matchers.js');
      helpers = require('./helpers.js');
}


describe("Grid cloneItems", function() {
  it("should clone items into an empty destination", function() {
    var items = [{}, {}, {}],
        dest = [];

    GridList.cloneItems(items, dest);

    expect(dest.length).toEqual(items.length);
  });

  it("should clone all the source properties", function() {
    var items = [{foo: 'bar', 54: 21}],
        dest = [];

    GridList.cloneItems(items, dest);

    expect(dest).toEqual(items);
  });

  it("should return the destination", function() {
    var items = [{}, {}, {}],
        dest = [];

    var ret = GridList.cloneItems(items, dest);

    expect(ret).toEqual(dest);
  });

  it("should create the destination if it doesn't exist", function() {
    var items = [{}, {}, {}];

    var ret = GridList.cloneItems(items);

    expect(ret).toEqual(items);
  });

  it("should overwrite existing properties when copying", function() {
    var items = [{foo: 'bar', 54: 21}],
        dest = [{foo: 'baz', 54: 33}];

    GridList.cloneItems(items, dest);

    expect(dest).toEqual(items);
  });
});
