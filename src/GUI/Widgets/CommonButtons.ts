import { ModVersion } from "../../Definition";
import { LocalizedText } from "../../i18n";
import { setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithInRect as WithinRect } from "./AGUI";

function ADrawTextButton(rect: IRect, Text: string, BackColor: string, Icon: string) {
    const align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    DrawButton(rect.x, rect.y, rect.width, rect.height, "", BackColor, Icon);
    DrawTextFit(Text, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width - rect.height, "Black");
    MainCanvas.textAlign = align;
}

function ADrawIconButton(rect: IRect, Text: string, BackColor: string, Icon: string) {
    DrawButton(rect.x, rect.y, rect.width, rect.height, "", BackColor, Icon);
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

    Draw() {
        if (this._icon && this._text) {
            ADrawTextButton(this._rect, this._text, "White", this._icon);
        } else if (this._icon) {
            ADrawIconButton(this._rect, "", "White", this._icon);
        } else if (this._text) {
            ADrawTextButton(this._rect, this._text, "White", "");
        }
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

    Draw() {
        ADrawIconButton(this._rect, "", "White", "Icons/Exit.png");
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

    Click(mouse: IPoint): void { }
}