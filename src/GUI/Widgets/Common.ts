import { ModVersion } from "../../Definition";
import { LocalizedText } from "../../i18n";
import { setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";

export function ADrawText(rect: IPoint, Text: string, color: string = 'Black') {
    MainCanvas.fillStyle = color;
    MainCanvas.fillText(Text, rect.x, rect.y);
}

export function ADrawTextFit(rect: IRect, Text: string, color: string = 'Black') {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const measure = MainCanvas.measureText(Text);
    MainCanvas.fillStyle = color;
    if (rect.width < measure.width) {
        const ratio = rect.width / measure.width;
        MainCanvas.scale(ratio, ratio);
        MainCanvas.fillText(Text, centerX, centerY);
        MainCanvas.scale(1 / ratio, 1 / ratio);
    } else {
        MainCanvas.fillText(Text, centerX, centerY);
    }
    MainCanvas.textAlign = align;
}

export function ADrawIconTextButton(rect: IRect, Text: string, Icon: string, active: boolean = true) {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    ADrawIconButton(rect, Icon, active);
    ADrawTextFit(rect, Text);
    MainCanvas.textAlign = align;
}

export function ADrawFramedRect(rect: IRect, fill: string, line: string = 'black', lineWidth: number = 2) {
    MainCanvas.rect(rect.x, rect.y, rect.width, rect.height);
    MainCanvas.fillStyle = fill;
    MainCanvas.fillRect(rect.x, rect.y, rect.width, rect.height);
    MainCanvas.lineWidth = lineWidth;
    MainCanvas.strokeStyle = line;
    MainCanvas.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

export function ADrawTextButton(rect: IRect, Text: string, active: boolean = true, background: { idle: string, hover: string } = { idle: "White", hover: "Cyan" }) {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    ADrawFramedRect(rect, active && WithinRect({ x: MouseX, y: MouseY }, rect) ? background.hover : background.idle, "Black", 2)
    ADrawTextFit(rect, Text);
    MainCanvas.textAlign = align;
}

export function ADrawIconButton(rect: IRect, Icon: string, active: boolean = true) {
    ADrawFramedRect(rect, active && WithinRect({ x: MouseX, y: MouseY }, rect) ? 'Cyan' : 'White', "Black", 2);
    DrawImage(Icon, rect.x + 2, rect.y + 2);
}

export class StdButton extends AGUIItem {
    private _rect: IRect;
    private _callback: () => void;
    private _text: string | null = null;
    private _icon: string | null = null;

    constructor(rect: IRect, text: string, callback: () => void, icon: string | null = null) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
        this._icon = icon;
    }

    Draw(hasFocus: boolean) {
        if (this._icon && this._text) {
            ADrawIconTextButton(this._rect, this._text, this._icon);
        } else if (this._icon) {
            ADrawIconButton(this._rect, this._icon);
        } else if (this._text) {
            ADrawIconTextButton(this._rect, this._text, "");
        }
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

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

export class TextButton extends AGUIItem {
    private _rect: IRect;
    private _callback: () => void;
    private _text: string;

    constructor(rect: IRect, text: string, callback: () => void) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
    }

    Draw(hasFocus: boolean) {
        ADrawTextButton(this._rect, this._text, hasFocus);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

export class ExitButton extends AGUIItem {
    private _rect: IRect = {
        x: 1815,
        y: 75,
        width: 90,
        height: 90
    };

    callback: () => void;

    constructor(callback: () => void) {
        super();
        this.callback = callback;
    }

    Draw(hasFocus: boolean) {
        ADrawIconButton(this._rect, "Icons/Exit.png", hasFocus);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this.callback();
    }
}

export class TitleText extends AGUIItem {
    constructor() { super(); }

    Draw() {
        ADrawText({ x: 200, y: 125 }, `${LocalizedText("responsive_setting_title")} v${ModVersion}`);
    }
}

export class BasicText extends AGUIItem {
    private _color: string;
    private _where: IPoint;
    private _text: string;
    private _align: CanvasTextAlign;

    constructor(where: IPoint, text: string, align: CanvasTextAlign = "left", color: string = "Black") {
        super();
        this._where = where;
        this._text = text;
        this._color = color;
        this._align = align;
    }

    Draw() {
        const align = MainCanvas.textAlign;
        MainCanvas.textAlign = this._align;
        MainCanvas.fillStyle = this._color;
        MainCanvas.fillText(this._text, this._where.x, this._where.y);
        MainCanvas.textAlign = align;
    }
}

export class DynamicText extends AGUIItem {
    private _pattern: () => { where: IPoint, text: string, align: CanvasTextAlign, color: string };

    constructor(pattern: () => { where: IPoint, text: string, align: CanvasTextAlign, color: string }) {
        super();
        this._pattern = pattern;
    }

    Draw() {
        const _align = MainCanvas.textAlign;

        const { where, text, align, color } = this._pattern();

        MainCanvas.textAlign = align;
        MainCanvas.fillStyle = color;
        MainCanvas.fillText(text, where.x, where.y);

        MainCanvas.textAlign = _align;
    }
}