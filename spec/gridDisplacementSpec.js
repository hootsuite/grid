// Load dependencies when run with Node (in browser they are expected to
// already be included)
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js').GridList;
}

describe("Grid positioning after moving", function() {

  var gridPositionOfWidgetsAfterDisplacement = function(inputItems, drop, gridListOptions) {
    var items = [],
        translatedItems = [],
        i, j,
        item,
        group,
        dropPosition;

    for (i = 0; i < inputItems.length; i++) {
      group = inputItems[i];
      for (j = 0; j < group.length; j++) {
        item = group[j];
        items.push({
          cols: item.cols,
          rows: item.rows,
          position: {
            col: item.x + (i * gridListOptions.colsPerGroup),
            row: item.y
          }
        });
      }
    }
    myGrid = new GridList(items, gridListOptions);

    dropPosition = position = {
      row: drop.y,
      col: drop.x + (drop.g * gridListOptions.colsPerGroup)
    };
    // TODO Generate item movement based on its previous position
    items[drop.index].move = {
      x: dropPosition.col - items[drop.index].position.col,
      y: dropPosition.row - items[drop.index].position.row
    };
    // Place item at the specificed drop
    items[drop.index].position = dropPosition;

    myGrid.generateIndexesFromPosition();
    myGrid.generatePositionsFromIndex();

    for (i = 0; i < items.length; i++) {
      item = items[i];
      group = Math.floor(item.position.col / gridListOptions.colsPerGroup);
      // Create group if this is first item in it
      if (!translatedItems[group]) {
        translatedItems[group] = [];
      }
      translatedItems[group].push({
        x: item.position.col % gridListOptions.colsPerGroup,
        y: item.position.row
      });
    }
    return translatedItems;
  };

  it("smallWidgetUnderAll", function() {
    expect(gridPositionOfWidgetsAfterDisplacement([[
      {x: 0, y: 0, cols: 2, rows: 1},
      {x: 2, y: 0, cols: 1, rows: 1},
      {x: 0, y: 1, cols: 2, rows: 1}
    ]], {
      index: 1,
      x: 0,
      y: 2,
      g: 0
    }, {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1}
    ]]);
  });

  it("bigWidgetToLeft", function() {
    expect(gridPositionOfWidgetsAfterDisplacement([[
      {x: 0, y: 0, cols: 1, rows: 1},
      {x: 1, y: 0, cols: 2, rows: 1},
      {x: 0, y: 1, cols: 1, rows: 2},
      {x: 1, y: 1, cols: 2, rows: 2},
      {x: 0, y: 3, cols: 3, rows: 1}
    ]], {
      index: 3,
      x: 0,
      y: 1,
      g: 0
    }, {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1},
      {x: 0, y: 3}
    ]]);
  });

  it("bigWidgetAbove", function() {
    expect(gridPositionOfWidgetsAfterDisplacement([[
      {x: 0, y: 0, cols: 1, rows: 1},
      {x: 1, y: 0, cols: 2, rows: 1},
      {x: 0, y: 1, cols: 1, rows: 2},
      {x: 1, y: 1, cols: 2, rows: 2},
      {x: 0, y: 3, cols: 3, rows: 1}
    ]], {
      index: 3,
      x: 1,
      y: 0,
      g: 0
    }, {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 2, y: 2}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("smallWidgetBelow", function() {
    expect(gridPositionOfWidgetsAfterDisplacement([[
      {x: 0, y: 0, cols: 1, rows: 1},
      {x: 1, y: 0, cols: 2, rows: 1},
      {x: 0, y: 1, cols: 1, rows: 2},
      {x: 1, y: 1, cols: 2, rows: 2},
      {x: 0, y: 3, cols: 3, rows: 1}
    ]], {
      index: 0,
      x: 0,
      y: 1,
      g: 0
    }, {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 1, y: 2}
    ], [
      {x: 0, y: 0}
    ]]);
  });

  it("smallWidgetToBottomRight", function() {
    expect(gridPositionOfWidgetsAfterDisplacement([[
      {x: 0, y: 0, cols: 1, rows: 1},
      {x: 1, y: 0, cols: 2, rows: 1},
      {x: 0, y: 1, cols: 1, rows: 2},
      {x: 1, y: 1, cols: 2, rows: 2},
      {x: 0, y: 3, cols: 3, rows: 1}
    ]], {
      index: 0,
      x: 1,
      y: 1,
      g: 0
    }, {
      rows: 4,
      colsPerGroup: 3
    })).toEqual([[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 2, y: 2}
    ], [
      {x: 0, y: 0}
    ]]);
  });

});
