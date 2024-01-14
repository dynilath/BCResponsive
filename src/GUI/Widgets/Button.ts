import { Styles } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";
import { ADrawCircleRect, ADrawTextButton, ADrawTextFit } from "./Common";
import { ADrawIconTextButton, ADrawIconButton } from "./Common";


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

export class DynamicTextRoundButton extends AGUIItem {
    readonly _rect: IRect;
    readonly _text: () => string;
    readonly _callback: () => void;

    enabled: (() => boolean) | undefined;

    constructor(rect: IRect, text: () => string, callback: () => void, enabled?: () => boolean) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
        this.enabled = enabled;
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this._rect)) {
                ADrawCircleRect(this._rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this._rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this._rect, this._text());
        } else {
            ADrawCircleRect(this._rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this._rect, this._text(), { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

export class TextRoundButton extends AGUIItem {
    readonly _rect: IRect;
    readonly _text: string;
    readonly _callback: () => void;

    enabled: (() => boolean) | undefined;

    constructor(rect: IRect, text: string, callback: () => void, enabled?: () => boolean) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
        this.enabled = enabled;
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this._rect)) {
                ADrawCircleRect(this._rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this._rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this._rect, this._text);
        } else {
            ADrawCircleRect(this._rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this._rect, this._text, { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
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

