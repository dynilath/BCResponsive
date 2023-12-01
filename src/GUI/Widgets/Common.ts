import { ModVersion } from "../../Definition";
import { LocalizedText } from "../../i18n";
import { setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";

export function ADrawButton(rect: IRect, Text: string, Icon: string) {
    DrawButton(rect.x, rect.y, rect.width, rect.height, Text, "White", Icon);
}

export function ADrawText(rect: IPoint, Text: string) {
    DrawText(Text, rect.x, rect.y, "Black");
}

export function ADrawIconTextButton(rect: IRect, Text: string, Icon: string, active: boolean = true) {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    DrawButton(rect.x, rect.y, rect.width, rect.height, "", "White", Icon, undefined, active);
    DrawTextFit(Text, rect.x + (rect.height + rect.width) / 2, rect.y + rect.height / 2, rect.width - rect.height, "Black");
    MainCanvas.textAlign = align;
}

export function ADrawTextButton(rect: IRect, Text: string, active: boolean = true) {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    DrawButton(rect.x, rect.y, rect.width, rect.height, "", "White", "", undefined, active);
    DrawTextFit(Text, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, "Black");
    MainCanvas.textAlign = align;
}

export function ADrawIconButton(rect: IRect, Icon: string, active: boolean = true) {
    DrawButton(rect.x, rect.y, rect.width, rect.height, "", "White", Icon, undefined, active);
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
        DrawText(`${LocalizedText("responsive_setting_title")} v${ModVersion}`, 200, 125, "Black");
    }
}

export class BasicText extends AGUIItem {
    private _where: IPoint;
    private _text: string;

    constructor(where: IPoint, text: string) {
        super();
        this._where = where;
        this._text = text;
    }

    Draw() {
        DrawText(this._text, this._where.x, this._where.y, "Black");
    }
}