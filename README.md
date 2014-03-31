GridList
====
Drag and drop library for a two-dimensional resizable and responsive list of
items

The GridList library is split into two roles:

1. An [agnostic GridList class](src/gridList.js) that manages the
two-dimensional positions from a list of items within a virtual matrix
2. A [jQuery plugin](src/jquery.gridList.js) built on top of the GridList class
that translates the generic items positions into responsive DOM elements with
drag and drop capabilities

## GridList class

```js
var gridList = new GridList(items, {rows: 3});
```

Here are the main functions of the GridList class:

- **findPositionForItem**: Generate new positions inside a 2d grid. The
positioning algorithm places items in columns, starting from left to right,
going through each column top to bottom
- **resize**: Convert item positions from one grid size to another, maintaining
as much of their order as possible
- **moveItemToPosition**: Handle collisions when moving an item over another
- **resizeItem**: Resize an item and reposition colliding items around.
**TODO:** Currently only the width of an item (w) can be resized

The size of an item is expressed using the number of cols and rows it takes up
within the grid (w and h). The position of an item is expressed using the col
and row position within the grid (x and y)

An item is an object of structure:
```js
{
  w: 3, h: 1,
  x: 0, y: 1
}
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

The rendered list is **responsive** to its parent container, meaning that the
width and height of the items are calculated based on the container height
divided by the number of grid rows.
