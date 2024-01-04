import { HTMLID } from "../GUI";
import { AGUIItem, IRect } from "./AGUI";

export class InputTextArea extends AGUIItem {
    _text: HTMLTextAreaElement;
    _rect: IRect;
    _id: string;
    _initiated: boolean = false;

    constructor(rect: IRect, id: string, bind: { text: string; }, hint?: string) {
        super();
        this._rect = rect;
        this._id = HTMLID(id);

        this._text = document.createElement("textarea");
        this._text.id = this._id;
        this._text.name = this._id;
        this._text.value = bind.text;
        this._text.setAttribute("screen-generated", CurrentScreen);

        this._text.className = "HideOnPopup";

        this._text.onchange = () => {
            bind.text = this._text.value;
        };

        document.body.appendChild(this._text);
    }

    InsertAtCursor(text: string) {
        const start = this._text.selectionStart;
        const end = this._text.selectionEnd;
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
