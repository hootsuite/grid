exports.addIndexesToItems = function(items) {
  /**
    Add indexes to items to match them after being reordered in the positioning
    process
  */
  for (var i = 0; i < items.length; i++) {
    items[i].index = i;
  }
};

exports.sortItemsByIndex = function(items) {
  items.sort(function(item1, item2) {
    if (item1.index < item2.index) {
      return -1;
    } else if (item1.index > item2.index) {
      return 1;
    } else {
      return 0;
    }
  });
};
