import { Calculate, Result } from "bc-utilities";
import { ModVersion } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint } from "./AGUI";
import { ADrawText } from "./Common";

export class TitleText extends AGUIItem {
    constructor() { super(); }

    Draw() {
        ADrawText({ x: 200, y: 125 }, `${GetText("responsive_setting_title")} v${ModVersion}`);
    }
}

export class BasicText extends AGUIItem {
    constructor(readonly where: IPoint, readonly text: Calculate<string>, readonly setting?: { align?: CanvasTextAlign; color?: string; }) {
        super();
    }

    Draw() {
        MainCanvas.textAlign = this.setting?.align || "left";
        MainCanvas.fillStyle = this.setting?.color || "Black";
        MainCanvas.fillText(Result(this.text), this.where.x, this.where.y);
    }
}

export class DynamicText extends AGUIItem {
    constructor(readonly pattern: () => { where: IPoint; text: string; align: CanvasTextAlign; color: string; }) {
        super();
    }

    Draw() {
        const { where, text, align, color } = this.pattern();
        MainCanvas.textAlign = align;
        MainCanvas.fillStyle = color;
        MainCanvas.fillText(text, where.x, where.y);
    }
}

