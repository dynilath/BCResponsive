import { Styles } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { ADrawCircleRect, ADrawFramedRect, ADrawTextFit } from "./Common";


export class SegmentButton extends AGUIItem {
    private readonly _rect: IRect;
    private readonly _rects: IRect[];

    private setting: {
        text: { display: string; value: string; }[];
        binding: Binding<string>;
    };

    constructor(setting: SegmentButton['setting'], rect: IRect) {
        super();

        const textWidths = setting.text.map(t => MainCanvas.measureText(t.display).width + Styles.Text.padding * 2);
        const increment = textWidths.reduce((prev, b) => {
            return prev.concat(prev[prev.length - 1] + b);
        }, [0]);

        const fullTextWidth = increment[increment.length - 1];

        this._rect = rect;

        const segWidth = rect.width - Styles.SegmentButton.border * 2;
        const segHeight = rect.height - Styles.SegmentButton.border * 2;

        this._rects = setting.text.map((_, index) => {
            return {
                x: rect.x + Styles.SegmentButton.border + segWidth * increment[index] / fullTextWidth,
                y: rect.y + Styles.SegmentButton.border,
                width: segWidth * textWidths[index] / fullTextWidth,
                height: segHeight
            };
        });
        this.setting = setting;
    }

    Draw(hasFocus: boolean) {
        const mouse = { x: MouseX, y: MouseY };
        ADrawCircleRect(this._rect);
        this._rects.forEach((r, i) => {
            if (this.setting.binding.value === this.setting.text[i].value) ADrawCircleRect(r, { fill: Styles.SegmentButton.active });
            if (WithinRect(mouse, r) && hasFocus) ADrawCircleRect(r, { fill: Styles.SegmentButton.hover, stroke: "none" });
            ADrawTextFit(r, this.setting.text[i].display);
        });
    }

    Click(mouse: IPoint) {
        this.setting.text.forEach((text, index) => {
            if (WithinRect(mouse, this._rects[index])) {
                this.setting.binding.value = text.value;
            }
        });
    }
}
