import { Styles } from "../../../Definition";
import { AGUIItem, IPoint, IRect, ISize, WithinRect } from "../../Widgets/AGUI";
import { ADrawFramedRect, AFillRect } from "../../Widgets/Common";

export class ActivityAreaDisplay extends AGUIItem {
    private readonly _translate: IPoint;
    private readonly _scale: number;

    private readonly source: Set<string>;

    private readonly _bodypart_rects: {
        group: string;
        rects: IRect[];
    }[];

    private readonly _callback: (v: string) => void;

    constructor(source: Set<string>, rect: IRect, callback: (v: string) => void) {
        super();
        this.source = source;
        this._callback = callback;

        const am = ActivityAreaDisplay.AbsoluteMetrics();
        const expectRatio = am.width / am.height;
        const givenRatio = rect.width / rect.height;

        if (expectRatio < givenRatio) {
            const centerX = rect.x + rect.width / 2;
            this._scale = rect.height / am.height;
            this._translate = { x: centerX - (am.x + am.width / 2) * this._scale, y: rect.y - am.y * this._scale };
        } else {
            const centerY = rect.y + rect.height / 2;
            this._scale = rect.width / am.width;
            this._translate = { x: rect.x - am.x * this._scale, y: centerY - (am.y + am.height / 2) * this._scale };
        }

        this._bodypart_rects = AssetGroup.map(v => {
            if (!v.Zone) return undefined;
            return { group: v.Name, rects: v.Zone.map(v => this.RectTuple2Rect(v)) };
        }).filter(v => v !== undefined) as { group: string; rects: IRect[] }[];
    }

    static AbsoluteMetrics(): IRect {
        const expectRange = AssetGroup.map(i => i.Zone).flat().reduce((prev, cur) => {
            if (!cur) return prev;
            return {
                left: Math.min(prev.left, cur[0]),
                right: Math.max(prev.right, cur[0] + cur[2]),
                top: Math.min(prev.top, cur[1]),
                bottom: Math.max(prev.bottom, cur[1] + cur[3]),
            };
        }, { left: 2000, top: 1000, bottom: 0, right: 0 });
        const expectWH = { width: expectRange.right - expectRange.left, height: expectRange.bottom - expectRange.top };
        return { x: expectRange.left, y: expectRange.top, width: expectWH.width, height: expectWH.height };
    }

    static Metrics(): ISize {
        const am = ActivityAreaDisplay.AbsoluteMetrics();
        return { width: am.width, height: am.height };
    }

    RectTuple2Rect(rect: [number, number, number, number]): IRect {
        return {
            x: rect[0] * this._scale + this._translate.x,
            y: rect[1] * this._scale + this._translate.y,
            width: rect[2] * this._scale,
            height: rect[3] * this._scale
        };
    }

    Draw(hasFocus: boolean): void {
        this._bodypart_rects.forEach((v, i) => {
            if (v.rects.length === 0) return;
            const isHover = hasFocus && v.rects.some(v => WithinRect({ x: MouseX, y: MouseY }, v));
            const isActive = this.source.has(v.group);
            v.rects.forEach((v) => {
                if (isActive) ADrawFramedRect(v, Styles.Chips.active, "Black");
                else ADrawFramedRect(v, "White", "Black");
                if (isHover) AFillRect(v, Styles.Chips.hover);

            });
        });
    }

    Click(mouse: IPoint): void {
        this._bodypart_rects.forEach((v, i) => {
            if (v.rects.length === 0) return;
            if (v.rects.some(v => WithinRect(mouse, v))) {
                this._callback(v.group);
            }
        });
    }
}
