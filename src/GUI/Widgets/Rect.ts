import { AGUIItem, IRect } from "./AGUI";
import { ADrawRoundRect } from "./Common";
import { ADrawFramedRect } from "./Common";


export class FramedRect extends AGUIItem {
    private _rect: IRect;
    private _color: string;

    constructor(rect: IRect, color: string) {
        super();
        this._rect = rect;
        this._color = color;
    }

    Draw() {
        ADrawFramedRect(this._rect, this._color);
    }
}
export class RoundFramedRect extends AGUIItem {
    private _rect: IRect;
    private _radius: number;
    private _fill: string;

    constructor(rect: IRect, radius: number, fill: string) {
        super();
        this._rect = rect;
        this._radius = radius;
        this._fill = fill;
    }

    Draw() {
        ADrawRoundRect(this._rect, this._radius, { fill: this._fill });
    }
}

