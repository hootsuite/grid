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
