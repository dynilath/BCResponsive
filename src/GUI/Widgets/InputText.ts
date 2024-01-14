import { HTMLID } from "../GUI";
import { AGUIItem, IRect } from "./AGUI";

export class TextAreaItem extends AGUIItem {
    private _text: HTMLTextAreaElement | undefined;
    private _rect: IRect;
    private _id: string;
    private _bind: { text: string; };

    get text() {
        return this._text?.value ?? "";
    }

    private CreateTextArea() {
        let text = document.createElement("textarea");
        text.id = this._id;
        text.name = this._id;
        text.value = this._bind.text;
        text.setAttribute("screen-generated", CurrentScreen);

        text.className = "HideOnPopup";

        text.onchange = () => {
            this._bind.text = this.text;
        };

        document.body.appendChild(text);

        return text;
    }

    constructor(rect: IRect, id: string, bind: { text: string; }, hint?: string) {
        super();
        this._rect = rect;
        this._id = HTMLID(id);
        this._bind = bind;

        this._text = this.CreateTextArea();
    }

    Clear() {
        if (!this._text) return;
        this._text.value = "";
        this._bind.text = "";
    }

    InsertAtCursor(text: string) {
        if (!this._text) return;
        const start = this._text.selectionStart;
        const end = this._text.selectionEnd;
        const oldText = this._text.value;
        this._text.value = oldText.substring(0, start) + text + oldText.substring(end);
        this._text.selectionStart = this._text.selectionEnd = start + text.length;
        this._text.focus();
    }

    Draw(hasFocus: boolean): void {
        if (!hasFocus) {
            if (this._text) this._text.remove();
            this._text = undefined;
        }

        if (!this._text) {
            this._text = this.CreateTextArea();
        }

        const HRatio = MainCanvas.canvas.clientHeight / 1000;
        const WRatio = MainCanvas.canvas.clientWidth / 2000;
        const Font = Math.min(MainCanvas.canvas.clientWidth / 50, MainCanvas.canvas.clientHeight / 25);

        const Height = this._rect.height * HRatio;
        const Width = this._rect.width * WRatio;
        const Top = MainCanvas.canvas.offsetTop + this._rect.y * HRatio;
        const Left = MainCanvas.canvas.offsetLeft + this._rect.x * WRatio;

        Object.assign(this._text.style, {
            fontSize: Font + "px",
            fontFamily: CommonGetFontName(),
            position: "fixed",
            left: Left + "px",
            top: Top + "px",
            width: Width + "px",
            height: Height + "px",
            display: "inline"
        });
    }

    Unload() {
        if (this._text) this._text.remove();
        this._text = undefined;
    }
}

export class InputItem extends AGUIItem {
    _text: HTMLInputElement;
    _rect: IRect;
    _id: string;

    get text() {
        return this._text.value;
    }

    constructor(rect: IRect, id: string, initText?: string, hint?: string) {
        super();
        this._rect = rect;
        this._id = HTMLID(id);

        this._text = document.createElement("input");
        this._text.id = this._id;
        this._text.name = this._id;
        this._text.value = initText ?? "";
        this._text.placeholder = hint ?? "";
        this._text.setAttribute("screen-generated", CurrentScreen);
        this._text.type = 'number';

        this._text.className = "HideOnPopup";
        document.body.appendChild(this._text);
    }

    Clear() {
        this._text.value = "";
    }

    InsertAtCursor(text: string) {
        const start = this._text.selectionStart;
        const end = this._text.selectionEnd;
        if (start === null || end === null) return;
        const oldText = this._text.value;
        this._text.value = oldText.substring(0, start) + text + oldText.substring(end);
        this._text.selectionStart = this._text.selectionEnd = start + text.length;
        this._text.focus();
    }

    Draw(hasFocus: boolean): void {
        const HRatio = MainCanvas.canvas.clientHeight / 1000;
        const WRatio = MainCanvas.canvas.clientWidth / 2000;
        const Font = Math.min(MainCanvas.canvas.clientWidth / 50, MainCanvas.canvas.clientHeight / 25);

        const Height = this._rect.height * HRatio;
        const Width = this._rect.width * WRatio;
        const Top = MainCanvas.canvas.offsetTop + this._rect.y * HRatio;
        const Left = MainCanvas.canvas.offsetLeft + this._rect.x * WRatio;

        Object.assign(this._text.style, {
            fontSize: Font + "px",
            fontFamily: CommonGetFontName(),
            position: "fixed",
            left: Left + "px",
            top: Top + "px",
            width: Width + "px",
            height: Height + "px",
            display: "inline"
        });

        this._text.disabled = !hasFocus;
    }

    Unload() {
        this._text.remove();
    }
}