var current_pos_x = 0;
var current_pos_y = 0;

function set_focus(x, y) {
    var grid = $('#grid').data('_gridList').gridList.grid;

    if (x < 0 || x >= grid.length || y < 0 || y >= grid[current_pos_x].length) {
        return;
    }
    var diff_x = x - current_pos_x;
    var diff_y = y - current_pos_y;
    while (grid[current_pos_x][current_pos_y] == grid[x][y] || grid[x][y] == null) {
        x += diff_x;
        y += diff_y;
        if (diff_x == 0 && diff_y == 0) {
            return;
        }
        if (x < 0 || x >= grid.length || y < 0 || y >= grid[current_pos_x].length) {
            return;
        }
    }

    grid[current_pos_x][current_pos_y].$element.removeClass('focus');
    current_pos_x = x;
    current_pos_y = y;
    grid[x][y].$element.addClass('focus');

//    $(grid[x][y]).intoViewport();
}

function current_cell() {
    var grid = $('#grid').data('_gridList').gridList.grid;

    if (current_pos_x >= 0 && current_pos_x < grid.length && current_pos_y >= 0 && current_pos_y < grid[current_pos_x].length) {
        return grid[current_pos_x][current_pos_y];
    }
    return false;
}

function get_x_y_of(cell) {
    for (var x = 0; x != grid.length; x++) {
        for (var y = 0; y != grid[x].length; y++) {
            if (cell == grid[x][y]) {
                return [x, y]
            }
        }
    }
    return null;
}

$(function(){
    $(document).keydown(function(e) {
        switch (e.keyCode) {
            case 39: // right arrow
                set_focus(current_pos_x+1, current_pos_y);
                e.preventDefault();
                return false;
            case 40: // down arrow
                set_focus(current_pos_x, current_pos_y+1);
                e.preventDefault();
                return false;
            case 37: // left arrow
                set_focus(current_pos_x-1, current_pos_y);
                e.preventDefault();
                return false;
            case 38: // up arrow
                set_focus(current_pos_x, current_pos_y-1);
                e.preventDefault();
                return false;
            default:
                break;
        }
        return true;
    });
});