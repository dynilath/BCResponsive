import { Colors } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";
import { ADrawFramedRect, ADrawTextFit } from "./Common";


export class SegmentButton extends AGUIItem {
    private readonly _rect: IRect;
    private readonly _rects: IRect[];
    private readonly _padding: number = 5;

    private setting: {
        text: { display: string; value: string; }[]; init: string; callback: (id: string) => void;
    };

    constructor(rect: IRect, setting: SegmentButton['setting']) {
        super();

        const textWidths = setting.text.map(t => MainCanvas.measureText(t.display).width + this._padding * 2);
        const increment = textWidths.reduce((prev, b) => {
            return prev.concat(prev[prev.length - 1] + b);
        }, [0]);

        const fullTextWidth = increment[increment.length - 1];

        this._rect = rect;
        this._rects = setting.text.map((text, index) => {
            return {
                x: rect.x + rect.width * increment[index] / fullTextWidth,
                y: rect.y,
                width: rect.width * textWidths[index] / fullTextWidth,
                height: rect.height
            };
        });
        this.setting = setting;
    }

    Draw(hasFocus: boolean) {
        ADrawFramedRect(this._rect, "White");
        this._rects.forEach((r, i) => {
            const color = WithinRect({ x: MouseX, y: MouseY }, r) && hasFocus ? Colors.Hover : this.setting.init === this.setting.text[i].value ? Colors.Active : "White";
            ADrawFramedRect(r, color);
            ADrawTextFit({ x: r.x + this._padding, y: r.y + this._padding, width: r.width - this._padding * 2, height: r.height - this._padding * 2 }, this.setting.text[i].display);
        });
    }

    Click(mouse: IPoint) {
        this.setting.text.forEach((text, index) => {
            if (WithinRect(mouse, this._rects[index])) {
                this.setting.init = text.value;
                this.setting.callback(text.value);
            }
        });
    }
}
