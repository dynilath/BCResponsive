import { Styles } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { ADrawCircleRect, ADrawFramedRect, ADrawTextFit } from "./Common";

interface SegmentButtonSetting {
    text: { display: string; value: string; }[];
    binding: Binding<string>;
}

export class SegmentButton extends AGUIItem {
    private readonly _rects: IRect[];

    constructor(readonly setting: SegmentButtonSetting, readonly rect: IRect) {
        super();

        const textWidths = setting.text.map(t => MainCanvas.measureText(t.display).width + Styles.Text.padding * 2);
        const increment = textWidths.reduce((prev, b) => {
            return prev.concat(prev[prev.length - 1] + b);
        }, [0]);

        const fullTextWidth = increment[increment.length - 1];

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
        ADrawCircleRect(this.rect);
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
