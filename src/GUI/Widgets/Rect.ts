import { AGUIItem, IRect } from "./AGUI";
import { ADrawRoundRect } from "./Common";
import { ADrawFramedRect } from "./Common";

export class FramedRect extends AGUIItem {
    constructor(readonly rect: IRect, readonly color: string) { super(); }
    Draw() { ADrawFramedRect(this.rect, this.color); }
}
export class RoundFramedRect extends AGUIItem {
    constructor(readonly rect: IRect, readonly radius: number, readonly fill: string) { super(); }
    Draw() { ADrawRoundRect(this.rect, this.radius, { fill: this.fill }); }
}

