// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js').GridList;
}

describe("Grid positioning for", function() {

  var gridPositionOfWidgets = function(items, gridListOptions) {
    var myGrid = new GridList(items, gridListOptions),
        translatedItems = [],
        i,
        item,
        group;
    myGrid.generatePositionsFromIndex();
    for (i = 0; i < items.length; i++) {
      item = items[i];
      group = Math.floor(item.position.col / myGrid.options.colsPerGroup);
      // Create group if this is first item in it
      if (!translatedItems[group]) {
        translatedItems[group] = [];
      }
      translatedItems[group].push({
        x: item.position.col % myGrid.options.colsPerGroup,
        y: item.position.row
      });
    }
    return translatedItems;
  };

  it("rightPositioning", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1}
    ]]);
  });

  it("longBarCharts", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 2},
      {cols: 2, rows: 1},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ]]);
  });

  it("placementAfterTimeline", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 4},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("timelineInNewGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("widget3xInNewGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2},
      {x: 2, y: 2},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("barchartWithMoreThan5Sources", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("barchartsGalore", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 2},
      {cols: 1, rows: 2},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 0, y: 3}
    ]]);
  });

  it("wideWidgetsAndTimeline", function() {
    expect(gridPositionOfWidgets([
      {cols: 3, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("wideWidgetInNewGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1},
      {cols: 3, rows: 0}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("emptySpaceFromWideAndTallWidgets", function() {
    expect(gridPositionOfWidgets([
      {cols: 3, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("twoTimelinesInGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 4},
      {cols: 1, rows: 4},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 2, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("manyShortWidgetsInGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 2, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 0, y: 2}
    ]]);
  });

  it("emptyRowInGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 3, rows: 1},
      {cols: 1, rows: 2},
      {cols: 2, rows: 1},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("twoSquareWidgets", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 2},
      {cols: 2, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 2}
    ]]);
  });

  it("emptyColumnInGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 2},
      {cols: 2, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 2}
    ], [
      {x: 0, y: 0},
      {x: 2, y: 0}
    ]]);
  });

  it("smallAndBigWidgets", function() {
    expect(gridPositionOfWidgets([
      {cols: 2, rows: 2},
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 2, rows: 2},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1}
    ], [
      {x: 0, y: 0},
      {x: 2, y: 0}
    ]]);
  });

  it("widgetUnderEmptySpace", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2}
    ]]);
  });

  it("allWidgetSizes", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 2},
      {cols: 1, rows: 1},
      {cols: 2, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 1, y: 2}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("bigBarchartInNewGroup", function() {
    expect(gridPositionOfWidgets([
      {cols: 1, rows: 4},
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ], [
      {x: 0, y: 0}
    ]]);
  });

});
