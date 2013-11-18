var GridTest = {
  testGridList: function (items, gridListOptions) {
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
  },
  testGridListMovement: function(inputItems, drop, gridListOptions) {
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
  },
  assertEqualObjects: function (returned, expected, message) {
    var equal = JSON.stringify(returned) == JSON.stringify(expected);
    message = '"' + message + '"';
    if (equal) {
      console.log('✔ Test passed', message);
    } else {
      console.error('✖ Test failed', message);
      console.error('  EXPECTED', expected);
      console.error('  RETURNED', returned);
    }
  }
};

var GridTestCases = {
  test: function(testCase) {
    var values = this[testCase]();
    GridTest.assertEqualObjects(values[0], values[1], testCase);
  },
  rightPositioning: function () {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1}
    ]];
    return [returned, expected];
  },
  longBarCharts: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 2},
      {cols: 2, rows: 1},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ]];
    return [returned, expected];
  },
  placementAfterTimeline: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 4},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  timelineInNewGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  widget3xInNewGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2},
      {x: 2, y: 2},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  barchartWithMoreThan5Sources: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  barchartsGalore: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 2},
      {cols: 1, rows: 2},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 0, y: 3}
    ]];
    return [returned, expected];
  },
  wideWidgetsAndTimeline: function() {
    var returned = GridTest.testGridList([
      {cols: 3, rows: 1},
      {cols: 2, rows: 1},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  wideWidgetInNewGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1},
      {cols: 3, rows: 0}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  emptySpaceFromWideAndTallWidgets: function() {
    var returned = GridTest.testGridList([
      {cols: 3, rows: 1},
      {cols: 1, rows: 2},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  twoTimelinesInGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 4},
      {cols: 1, rows: 4},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 2, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  manyShortWidgetsInGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 1},
      {cols: 1, rows: 1},
      {cols: 1, rows: 1},
      {cols: 2, rows: 1},
      {cols: 3, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 0, y: 2}
    ]];
    return [returned, expected];
  },
  emptyRowInGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 3, rows: 1},
      {cols: 1, rows: 2},
      {cols: 2, rows: 1},
      {cols: 3, rows: 1},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 0, y: 3}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  twoSquareWidgets: function() {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 2},
      {cols: 2, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 2}
    ]];
    return [returned, expected];
  },
  emptyColumnInGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 2},
      {cols: 2, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 4}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 2}
    ], [
      {x: 0, y: 0},
      {x: 2, y: 0}
    ]];
    return [returned, expected];
  },
  smallAndBigWidgets: function() {
    var returned = GridTest.testGridList([
      {cols: 2, rows: 2},
      {cols: 1, rows: 1},
      {cols: 1, rows: 2},
      {cols: 2, rows: 2},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1}
    ], [
      {x: 0, y: 0},
      {x: 2, y: 0}
    ]];
    return [returned, expected];
  },
  widgetUnderEmptySpace: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 1}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2}
    ]];
    return [returned, expected];
  },
  allWidgetSizes: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 2},
      {cols: 1, rows: 1},
      {cols: 2, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 1, y: 2}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  bigBarchartInNewGroup: function() {
    var returned = GridTest.testGridList([
      {cols: 1, rows: 4},
      {cols: 1, rows: 1},
      {cols: 2, rows: 2},
      {cols: 1, rows: 2}
    ], {
      rows: 4,
      colsPerGroup: 3
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  MOVEsmallWidgetUnderAll: function() {
    var returned = GridTest.testGridListMovement([[
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
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1}
    ]];
    return [returned, expected];
  },
  MOVEbigWidgetToLeft: function() {
    var returned = GridTest.testGridListMovement([[
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
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1},
      {x: 0, y: 3}
    ]];
    return [returned, expected];
  },
  MOVEbigWidgetAbove: function() {
    var returned = GridTest.testGridListMovement([[
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
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 2},
      {x: 2, y: 2}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  MOVEsmallWidgetBelow: function() {
    var returned = GridTest.testGridListMovement([[
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
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 1, y: 2}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  },
  MOVEsmallWidgetToBottomRight: function() {
    var returned = GridTest.testGridListMovement([[
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
    });
    var expected = [[
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: 2, y: 2}
    ], [
      {x: 0, y: 0}
    ]];
    return [returned, expected];
  }
};

// Enable node module
if (typeof(require) == 'function') {
  var GridList = require('../lib/gridList.js').GridList;
}

GridTestCases.test('rightPositioning');
GridTestCases.test('longBarCharts');
GridTestCases.test('placementAfterTimeline');
GridTestCases.test('timelineInNewGroup');
GridTestCases.test('widget3xInNewGroup');
GridTestCases.test('barchartWithMoreThan5Sources');
GridTestCases.test('barchartsGalore');
GridTestCases.test('wideWidgetsAndTimeline');
GridTestCases.test('wideWidgetInNewGroup');
GridTestCases.test('emptySpaceFromWideAndTallWidgets');
GridTestCases.test('twoTimelinesInGroup');
GridTestCases.test('manyShortWidgetsInGroup');
GridTestCases.test('emptyRowInGroup');
GridTestCases.test('twoSquareWidgets');
GridTestCases.test('emptyColumnInGroup');
GridTestCases.test('smallAndBigWidgets');
GridTestCases.test('widgetUnderEmptySpace');
GridTestCases.test('allWidgetSizes');
GridTestCases.test('bigBarchartInNewGroup');

GridTestCases.test('MOVEsmallWidgetUnderAll');
GridTestCases.test('MOVEbigWidgetToLeft');
GridTestCases.test('MOVEbigWidgetAbove');
GridTestCases.test('MOVEsmallWidgetBelow');
GridTestCases.test('MOVEsmallWidgetBelow');
GridTestCases.test('MOVEsmallWidgetToBottomRight');
