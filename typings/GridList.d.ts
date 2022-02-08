declare namespace GridListUtils {
	export interface GridList {
		new (items: GridListItem[], options: GridListOptions): GridList;
		items: GridListItem[];
		cloneItems(items: GridListItem[], _items: GridListItem[]): GridListItem[];
		toString(): string;
		generateGrid(): void;
		resizeGrid(lanes: number): void;
		findPositionForItem(item: GridListItem, start: Vector2, fixedRow: number): Vector2Tuple;
		moveItemToNewPosition(item: GridListItem, newPosition: Vector2Tuple): void;
		resizeItem(item: GridListItem, size: Dimension2): void;
		getChangedItems(initialItems: GridListItem[], idAttribute: string): GridListItem[];
	}

	interface GridListOptions {
		direction?: Direction;
		lanes?: number;
	}

	interface GridListItem extends Vector2, Dimension2 {
		$element?: JQuery; // JQuery dependency version
		// $element?: any; // non JQuery dependency version
		Html?: string;
	}

	interface Vector2 {
		x: number;
		y: number;
	}

	/**
	 * [0]: x position
	 * [1]: y position
	 */
	type Vector2Tuple = [number, number];

	interface Dimension2 {
		w: number;
		h: number;
	}

	type Direction = "horizontal" | "vertical";

	interface DraggableGridList {
		new (element: Element, options: DraggableGridListOptions, draggableOptions: DraggableOptions): DraggableGridList;
		gridList: GridList;
		destroy(): void;
		resize(lanes: number): void;
		resizeItem(element: Element | string | JQuery, size: Dimension2): void;
		// resizeItem(element: Element | string | any, size: Dimension2): void;
		reflow(): void;
		render(): void;
	}

	interface DraggableGridListOptions extends GridListOptions {
		itemSelector?: string;
		widthHeightRatio?: number;
		dragAndDrop?: boolean;
	}

	interface DraggableOptions {
		zIndex?: number;
		scroll?: boolean;
		// sorry, the documentation for JQuery UI is pretty non-specific about the options for containment
		containment?: any;
	}
}

declare var DraggableGridList: GridListUtils.DraggableGridList;
declare var GridList: GridListUtils.GridList;