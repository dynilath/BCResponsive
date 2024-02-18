import { GUISettingScreen, hasFocus, setSubscreen } from "../GUI";

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISize {
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
    MouseWheel(event: WheelEvent): void { };
    Unload(): void { };
}

export class AGUIScreen extends GUISettingScreen {
    items: AGUIItem[];
    constructor(readonly prev: GUISettingScreen | null, items: AGUIItem[] = []) {
        super();
        this.items = items;
    }

    AddItem(item: AGUIItem) {
        this.items.push(item);
    }

    Run(): void {
        this.items.forEach(item => item.Draw(hasFocus(this)));
    }

    Click(): void {
        this.items.forEach(item => item.Click({ x: MouseX, y: MouseY }));
    }

    MouseWheel(event: WheelEvent): void {
        this.items.forEach(item => item.MouseWheel(event));
    }

    Exit(): void {
        setSubscreen(this.prev);
    }

    Unload(): void {
        this.items.forEach(item => item.Unload());
    }
}

export function WithinRect(mouse: IPoint, rect: IRect): boolean {
    return mouse.x >= rect.x && mouse.x <= rect.x + rect.width && mouse.y >= rect.y && mouse.y <= rect.y + rect.height;
}