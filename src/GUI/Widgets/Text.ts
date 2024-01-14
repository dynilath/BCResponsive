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
    private _where: IPoint;
    private _text: string;

    private setting: {
        align: CanvasTextAlign;
        color: string;
    };

    constructor(where: IPoint, text: string, setting?: Partial<BasicText['setting']>) {
        super();
        this._where = where;
        this._text = text;

        if (!setting) setting = {};
        this.setting = {
            align: setting.align || "left",
            color: setting.color || "Black"
        };
    }

    Draw() {
        MainCanvas.textAlign = this.setting.align;
        MainCanvas.fillStyle = this.setting.color;
        MainCanvas.fillText(this._text, this._where.x, this._where.y);
    }
}

export class DynamicText extends AGUIItem {
    private _pattern: () => { where: IPoint; text: string; align: CanvasTextAlign; color: string; };

    constructor(pattern: () => { where: IPoint; text: string; align: CanvasTextAlign; color: string; }) {
        super();
        this._pattern = pattern;
    }

    Draw() {
        const { where, text, align, color } = this._pattern();
        MainCanvas.textAlign = align;
        MainCanvas.fillStyle = color;
        MainCanvas.fillText(text, where.x, where.y);
    }
}

