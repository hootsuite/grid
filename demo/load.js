$(function() {
  var DemoGrid = {
    el: $('#grid'),
    currentSize: 1,
    buildElements: function(items) {
      var item, i;
      for (i = 0; i < items.length; i++) {
        item = items[i];
        $item = $(
          '<li>' +
            '<div class="inner">' +
              '<div class="controls">' +
                '<a href="#zoom1" class="resize" data-size="1">1x</a>' +
                '<a href="#zoom2" class="resize" data-size="2">2x</a>' +
                '<a href="#zoom3" class="resize" data-size="3">3x</a>' +
              '</div>' +
              i +
            '</div>' +
          '</li>'
        );
        $item.attr({
          'data-w': item.w,
          'data-h': item.h,
          'data-x': item.x,
          'data-y': item.y
        });
        this.el.append($item);
      }
    },
    resize: function(size) {
      if (size) {
        this.currentSize = size;
      }
      this.el.gridList('resize', this.isHorizontal() ? this.currentSize : 0, this.isVertical() ? this.currentSize : 0);
    },
    flashItems: function(items) {
      // Hack to flash changed items visually
      for (var i = 0; i < items.length; i++) {
        (function($element) {
          $element.addClass('changed')
          setTimeout(function() {
            $element.removeClass('changed');
          }, 0);
        })(items[i].$element);
      }
    },
    isHorizontal: function() {
      return this.el.parent().hasClass('horizontal');
    },
    isVertical: function() {
      return this.el.parent().hasClass('vertical');
    }
  };

  DemoGrid.currentSize = DemoGrid.isHorizontal() ? 3 : 5;
  DemoGrid.buildElements(DemoGrid.isHorizontal() ? fixtures.DEMO : fixtures.DEMO2);

  DemoGrid.el.gridList({
    rows: DemoGrid.isHorizontal() ? DemoGrid.currentSize : 0,
    cols: DemoGrid.isVertical() ? DemoGrid.currentSize : 0,
    widthHeightRatio: 264 / 294,
    heightToFontSizeRatio: 0.25,
    onChange: function(changedItems) {
      DemoGrid.flashItems(changedItems);
    }
  });
  DemoGrid.el.find('li .resize').click(function(e) {
    e.preventDefault();
    var itemElement = $(e.currentTarget).closest('li'),
        itemSize = $(e.currentTarget).data('size');
    DemoGrid.el.gridList('resizeItem', itemElement, itemSize);
  });
  $('.add-row').click(function(e) {
    e.preventDefault();
    DemoGrid.resize(DemoGrid.currentSize + 1);
  });
  $('.remove-row').click(function(e) {
    e.preventDefault();
    DemoGrid.resize(Math.max(1, DemoGrid.currentSize - 1));
  });
  $(window).resize(function() {
    DemoGrid.resize();
  });
});
