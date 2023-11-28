import { GUISettingScreen, setSubscreen } from "../GUI";

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export abstract class AGUIItem {
    abstract Draw(): void;
    Click(mouse: IPoint): void { };
}

export class AGUIScreen extends GUISettingScreen {
    private _prev: GUISettingScreen | null = null;

    private _items: AGUIItem[] = [];

    constructor(prev: GUISettingScreen | null, items: AGUIItem[] = []) {
        super();
        this._prev = prev;
        this._items = items;
    }

    AddItem(item: AGUIItem) {
        this._items.push(item);
    }

    set Items(items: AGUIItem[]) {
        this._items = items;
    }

    Run(): void {
        this._items.forEach(item => item.Draw());
    }

    Click(): void {
        this._items.forEach(item => item.Click({ x: MouseX, y: MouseY }));
    }

    Exit(): void {
        setSubscreen(this._prev);
    }
}

export function WithinRect(mouse: IPoint, rect: IRect): boolean {
    return mouse.x >= rect.x && mouse.x <= rect.x + rect.width && mouse.y >= rect.y && mouse.y <= rect.y + rect.height;
}