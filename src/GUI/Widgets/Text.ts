import { Calculate, Result } from "../utils";
import { ModInfo } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect } from "./AGUI";
import { ADrawText, ADrawTextFit } from "./Common";

export class TitleText extends AGUIItem {
    constructor() { super(); }

    Draw() {
        const text = GetText("responsive_setting_title");
        ADrawText({ x: 201, y: 126 }, `${text} v${ModInfo.version}`, { color: "Gray" });
        ADrawText({ x: 200, y: 125 }, `${text} v${ModInfo.version}`);
    }
}

export class BasicText extends AGUIItem {
    constructor(readonly where: IPoint, readonly text: Calculate<string>, readonly setting?: { align?: CanvasTextAlign; color?: string; emphasis?: boolean; }) {
        super();
    }

    Draw() {
        MainCanvas.textAlign = this.setting?.align || "left";
        MainCanvas.fillStyle = this.setting?.color || "Black";
        const text = Result(this.text);
        if (this.setting?.emphasis) MainCanvas.fillText(text, this.where.x + 1, this.where.y + 1);
        MainCanvas.fillText(text, this.where.x, this.where.y);
    }
}

export class FitText extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: Calculate<string>, readonly setting?: { color?: string; emphasis?: boolean; }) {
        super();
    }

    Draw() { ADrawTextFit(this.rect, Result(this.text), this.setting); }
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

