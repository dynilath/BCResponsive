import { GUISettingScreen, hasFocus, setSubscreen } from "../GUI";

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
    abstract Draw(hasFocus: boolean): void;
    Click(mouse: IPoint): void { };
    Unload(): void { };
}

export class AGUIScreen extends GUISettingScreen {
    protected _prev: GUISettingScreen | null = null;

    protected _items: AGUIItem[] = [];

    constructor(prev: GUISettingScreen | null, items: AGUIItem[] = []) {
        super();
        this._prev = prev;
        this._items = items;
    }

    AddItem(item: AGUIItem) {
        this._items.push(item);
    }

    Run(): void {
        this._items.forEach(item => item.Draw(hasFocus(this)));
    }

    Click(): void {
        this._items.forEach(item => item.Click({ x: MouseX, y: MouseY }));
    }

    Exit(): void {
        setSubscreen(this._prev);
    }

    Unload(): void {
        this._items.forEach(item => item.Unload());
    }
}

export function WithinRect(mouse: IPoint, rect: IRect): boolean {
    return mouse.x >= rect.x && mouse.x <= rect.x + rect.width && mouse.y >= rect.y && mouse.y <= rect.y + rect.height;
}