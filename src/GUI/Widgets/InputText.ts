import { HTMLID } from "../GUI";
import { AGUIItem, IRect } from "./AGUI";
import { StylesRect } from "./CSStyle";

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

        StylesRect(this._rect, this._text);
    }

    Unload() {
        if (this._text) this._text.remove();
        this._text = undefined;
    }
}

export class TextInput extends AGUIItem {
    _text: HTMLInputElement | undefined;
    _rect: IRect;
    _id: string;
    _hint: string | undefined;

    get text() {
        return this._text?.value ?? "";
    }

    private CreateInput() {
        let text = document.createElement("input");
        text.id = this._id;
        text.name = this._id;
        text.value = "";
        text.setAttribute("screen-generated", CurrentScreen);
        text.type = 'text';

        text.className = "HideOnPopup";

        if (this._hint) {
            text.placeholder = this._hint;
        }

        document.body.appendChild(text);

        return text;
    }

    constructor(rect: IRect, id: string, initText?: string, hint?: string) {
        super();
        this._rect = rect;
        this._id = HTMLID(id);
        this._hint = hint;

        this._text = this.CreateInput();
        if (initText) this._text.value = initText;
    }

    Clear() {
        if (!this._text) return;
        this._text.value = "";
    }

    InsertAtCursor(text: string) {
        if (!this._text) return;
        const start = this._text.selectionStart;
        const end = this._text.selectionEnd;
        if (start === null || end === null) return;
        const oldText = this._text.value;
        this._text.value = oldText.substring(0, start) + text + oldText.substring(end);
        this._text.selectionStart = this._text.selectionEnd = start + text.length;
        this._text.focus();
    }

    Draw(hasFocus: boolean): void {
        if (!hasFocus) {
            if (this._text) this._text.remove();
            this._text = undefined;
            return;
        }

        if (!this._text) {
            this._text = this.CreateInput();
        }

        StylesRect(this._rect, this._text);
    }

    Unload() {
        if (this._text)
            this._text.remove();
        this._text = undefined;
    }
}