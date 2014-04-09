GridList [![Build Status](https://travis-ci.org/uberVU/grid.svg?branch=master)](https://travis-ci.org/uberVU/grid)
====
Drag and drop library for a two-dimensional resizable and responsive list of
items

**Demo: http://ubervu.github.io/grid/**

**Disclaimer: The current implementation is for a horizontal grid. This means
that the number of rows is configurable, whereas columns extend dynamically,
based on the number, size and position of items placed inside the grid.** While
this is by design, most, if not all, logic was built around the idea that at
any point the other axis could be supported with minor/moderate code changes,
making both orientations available through the use of an single option.

The GridList library is split into two roles:

1. An agnostic [**GridList class**](#gridlist-class) that manages the
two-dimensional positions from a list of items within a virtual matrix
2. A [**jQuery plugin**](#fngridlist) built on top of the GridList class
that translates the generic items positions into responsive DOM elements with
drag and drop capabilities

## GridList class

Jump to:

- [**API**](#api)
- [**Primitives**](#primitives)

### API

#### new GridList(items, options)

```js
var myGrid = new GridList(items, {rows: 3});
```

The first constructor parameter is an array of [items](#primitives) to populate
the grid with.

 Supported options:

 - **rows** - Number of rows for the grid

#### generateGrid()

```js
myGrid.generateGrid();
```

Build the grid structure from scratch, using the positions of the given
items. If items lack positional attributes (x and y), they will be misplaced,
possibly overlapping. If you want to build a grid around a list of items that
only have their size attributes defined (w and h), and rely on the library to
position them two-dimensionally, use [_resizeGrid._](#resizegridrows)

#### resizeGrid(rows)

```js
myGrid.resizeGrid(4);
```

(Re)generate positions for the items inside a grid instance for a given number
of rows. This method has two major use-cases:

1. Items are being represented two-dimensionally for the first time
2. Items already have 2d positions but need to be represented on a different
grid size, maintaining as much as possible of their previous order

Given the horizontal orientation, positions inside the grid are generated
left-to-right, top-to-bottom. So when looking for a new position inside the
grid the topmost row from the leftmost column is chosen.

#### moveItemToPosition(item, position)

```js
// Move item from [0, 0] to [1, 1]
var carefreeItem = myGrid.grid[0][0];
myGrid.moveItemToPosition(carefreeItem, [1, 1]);
```

Here are things that happen when moving an item inside the grid:

1. The item's previous position is cleared inside the [2d grid](#gridlistgrid)
2. The position inside the [item object](#item) is updated
3. The item's new position is marked inside the 2d grid
4. Collisions are handled if the moved item overlaps with other item(s) from
the grid

Collisions can be solved in two ways. First, an attempt to resolve them
_locally_ is made, meaning that the moved item tries to swap position with
the overlapped item(s). This is the preferred _fair trade._ If this doesn't
work out and after swapping we still have collisions inside the grid, the
entire grid will be [regenerated](#resizegridrows), starting with the moved
item fixed in its new position. In the latter case, all the items around and
to the right of the moved item might have their position slightly altered.

#### resizeItem(item, width)

```js
// Resize item from position [0, 0] to span over 3 columns
var growthItem = myGrid.grid[0, 0];
myGrid.resizeItem(growthItem, 3);
console.log(growthItem.w); // will output "3"
```

Resizing an item is very similar to moving its position, in the sense that
[grid](#gridlistgrid) cells will be repopulated and collisions will be handled
afterwards. See [moveItemToPosition.](#moveitemtopositionitem-position)

_TODO: Implement resizing of item height_

### Primitives

#### Item

The item is the building block of GridList, and is a plain JavaScript object.
The primary function of the GridList is to position such items
two-dimentionally. Which brings us to the composition of an item: **w** and
**h** for size, **x** and **y** for position. E.g.

```js
{w: 3, h: 1, x: 0, y: 1}
```

Note that x and y (**column** and **row**) are abstract coords inside the grid,
they are integer values starting from 0. Naturally, w and h (**width** and
**height**) also take up space in the same coordinate system, which reveals the
smallest unit of a grid: the **cell.** You could say, for example, that the
featured item above takes up three grid cells.

#### gridList.items

A GridList instance works around an array of items. The items array is the
first parameter of the class constructor and is always visible under the
`.items` property. Here's a list of items for a grid with three 1x1 items on a
column with three rows:

```js
[{w: 1, h: 1, x: 0, y: 0},
 {w: 1, h: 1, x: 0, y: 1},
 {w: 1, h: 1, x: 0, y: 2}]
```

#### gridList.grid

Seeing how JavaScript doesn't support multidimensional arrays, the 2d grid
inside GridList is represented by an array for columns, with each array entry
containing another array with cells for each row. __The cell is simply a pointer
to an item that occupies it, or a *null* reference if no item is sitting on
that cell's position.__ Note that more cells can point to the same item
reference, because items occupy `w * h` cells. Here's a grid
pseudo-representation:

| col1 | col2 | col3 | col4 |
| :--: | :--: | :--: | :--: |
| 1    | 2    |      |      |
| 1    | 3    | 4    | 4    |
| 1    |      | 4    | 4    |

Having the grid in a two-dimensional data structure, we can fetch item
references directly by targeting any of the cells they cover inside the grid.
E.g.

```js
myGrid.grid[1][0] // reference to item #2
myGrid.grid[1][1] // reference to item #3
myGrid.grid[2][1] // reference to item #4
myGrid.grid[3][2] // still reference to item #4
```

PS. This grid would be generated by these items:

```js
[{w: 1, h: 3, x: 0, y: 0},
 {w: 1, h: 1, x: 1, y: 0},
 {w: 1, h: 1, x: 1, y: 1},
 {w: 2, h: 2, x: 2, y: 1}]
```

## $.fn.gridList

```js
$('.my-list').gridList({rows: 3});
```

The jQuery plugin has two main functions:

- Render the GridList on top of a list of **DOM elements.** The list items are
expected to have `data-w` and `data-h` attributes, and optionally `data-x` and
`data-y` (if their positions have been previously generated and persisted)
- **Drag and drop** capabilities

The function takes an optional argument with options that will be passed to the
draggables when constructing them.

```js
$('.my-list').gridList({rows: 3}, {handle: '.title');
```

See [jQuery UI Draggable API](api.jqueryui.com/draggable/) for details on all
the available options.

The rendered list is **responsive** to its parent container, meaning that the
width and height of the items are calculated based on the container height
divided by the number of grid rows.

## FAQ: Why not [gridster](https://github.com/ducksboard/gridster.js)?

- Their README reads Ducksboard is no longer active in their development. There
are a few notable forks but it's hard to assert their [reliability.](https://github.com/dustmoo/gridster.js/issues)
- gridster works vertically and our design is horizontal. We instigated a
gridster pull request that attempted to make gridster work both ways and it
didn't seem to stabilize any time soon, plus the code was too complex to
approach. Our lib ended up having over than 5 times fewer code.
- gridster collisions are [very basic](https://github.com/ducksboard/gridster.js/issues/54),
we pushed towards better UX and found alternative ways for dealing with
collisions.
- We wanted out-of-the-box responsiveness, and the entire grid system was build
fluid, relative to any parent container.
- We needed the grid logic to be a DOM-less lib outside the jQuery plugin. This
allows us to compute grid positions on the server-side and run kick-ass fast
tests with Node.
- Another more particular thing we needed was widgets that had height=0, which
means they stretch on however many rows a grid has. We show timelines like
this. The same can be easily adapted for width in vertical grids.

*Please check [demo page](http://ubervu.github.io/grid/) or code directly for
investigating these assumptions.*
