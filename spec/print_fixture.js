/* Illustates widget positions on grid from fixtures

    #| 0  1  2  3  4  5  6  7  8  9
    --------------------------------
    0| 00 03 04 04 08 08 08 13 14 xx
    1| 01 03 05 05 09 11 11 13 15 xx
    2| 02 03 06 07 10 12 12 13 16 xx
    3| xx 03 xx xx xx xx xx 13 xx xx
    4| xx 03 xx xx xx xx xx 13 xx xx
    5| xx 03 xx xx xx xx xx 13 xx xx
*/
var fixtures = require('./fixtures.js');
var s = require('util').print;

if (!process.argv[2]){
    s('\nUsage: node print_fixture.js GRID2.rows3\n');
    return ;
};

var args = process.argv[2].split('.');
var fixture = fixtures[args[0]][args[1]];

function get_position(fixture, x,y){
    for (var i=0;i<fixture.length;i++){
        height = fixture[i]['h']
        if (height == 0){height = 999};

        if (fixture[i]['x'] <= x && ((fixture[i]['x'] + fixture[i]['w']) > x) &&
            fixture[i]['y'] <= y && ((fixture[i]['y'] + height) > y)){
            return i;
        }
    };
    return 'xx'
};

s('\n   #| 0  1  2  3  4  5  6  7  8  9 10 11 12\n');
s('   -------------------------------------------');
for (var i=0; i<6; i++){
    s('\n   '+i+'|');
    for (var j=0; j<13; j++){
        s(' ');
        widget_name = get_position(fixture, j, i);
        if (widget_name <= 9){s('0');}
        s(widget_name);
    }
};
s('\n\n');
