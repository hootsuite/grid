/* Illustates widget positions on grid from fixtures
../grid/spec $ node print_fixture.js GRID2.rows2

   #|  0  1  2  3  4  5  6  7  8  9 10 11 12 13
   --------------------------------------------
   0| 00 02 03 04 04 06 08 08 08 12 12 13 14 16
   1| 01 -- 03 05 05 07 09 10 11 11 -- 13 15 --

*/
var fixtures = require('./fixtures.js');
var print = require('util').print;
var GridList = require('../src/gridList.js');

if (!process.argv[2]){
    print('\nUsage: node print_fixture.js GRID2.rows3\n');
    return ;
};
var args = process.argv[2].split('.');
var fixture = fixtures[args[0]][args[1]];
grid = new GridList(fixture, {rows: 3});
print(grid);
