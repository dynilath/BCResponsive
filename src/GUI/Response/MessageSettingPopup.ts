import { GUISettingScreen } from "../GUI";
import { IPoint, IRect } from "../Widgets/AGUI";
import { BasicText, FramedRect, SegmentButton, TextButton } from "../Widgets/Common";
import { InputTextArea } from "../Widgets/InputText";
import { Popup } from "../Widgets/Popup";


export class MessageSettinPopup extends Popup {
    private readonly _dialog: IRect;
    private readonly _title: IPoint;
    private readonly _input: IRect;
    private readonly _type_segbutton: IRect;
    private readonly _insert_me_button: IRect;
    private readonly _insert_other_button: IRect;
    private readonly _cancel_button: IRect;
    private readonly _confirm_button: IRect;


    private _input_state: ResponsiveMessage;

    constructor(prev: GUISettingScreen | null, target: ResponsiveMessage) {
        super(prev);

        const centerX = 1000;
        const centerY = 500;

        const dialogPadding = 35;
        const FontSize = 36;

        const inputWidth = 800;
        const inputHeight = 500;

        const spacing = 15;

        const buttonWidth = 200;
        const buttonHeight = 50;

        const dialogTotalWidth = Math.max(inputWidth, buttonWidth * 3 + spacing * 2);
        const dialogTotalHeight = FontSize + inputHeight + buttonHeight * 2 + spacing * 3;
        this._dialog = {
            x: centerX - dialogTotalWidth / 2 - dialogPadding,
            y: centerY - dialogTotalHeight / 2 - dialogPadding,
            width: dialogTotalWidth + dialogPadding * 2,
            height: dialogTotalHeight + dialogPadding * 2
        };

        this._title = { x: centerX, y: this._dialog.y + dialogPadding + FontSize / 2 };

        this._type_segbutton = {
            x: centerX - dialogTotalWidth / 2,
            y: centerY - dialogTotalWidth / 2 + FontSize + spacing,
            width: buttonWidth, height: buttonHeight
        };

        this._insert_me_button = {
            x: centerX + dialogTotalWidth / 2 - buttonWidth * 2 - spacing,
            y: this._type_segbutton.y,
            width: buttonWidth, height: buttonHeight
        };

        this._insert_other_button = {
            x: centerX + dialogTotalWidth / 2 - buttonWidth,
            y: this._type_segbutton.y,
            width: buttonWidth, height: buttonHeight
        };

        this._input = {
            x: centerX - inputWidth / 2,
            y: this._type_segbutton.y + spacing + buttonHeight,
            width: inputWidth, height: inputHeight
        };

        this._confirm_button = {
            x: centerX + dialogTotalWidth / 2 - buttonWidth,
            y: this._input.y + inputHeight + spacing,
            width: buttonWidth, height: buttonHeight
        }

        this._cancel_button = {
            x: centerX + dialogTotalWidth / 2 - buttonWidth * 2 - spacing,
            y: this._input.y + inputHeight + spacing,
            width: buttonWidth, height: buttonHeight
        };

        this._input_state = { ...target };

        this._items = [
            new FramedRect(this._dialog, "White"),
            new BasicText(this._title, "Edit Message", { align: "center" }),
            new InputTextArea(this._input, "InputMessage", { text: this._input_state.content }),
            new SegmentButton(this._type_segbutton, {
                text: ["message", "action"].map(type => ({ display: type, value: type })),
                init: this._input_state.type,
                callback: (text) => {
                    this._input_state.type = text as ResponsiveMessage["type"];
                }
            }),
            new TextButton(this._insert_me_button, "Insert Me", () => { }),
            new TextButton(this._insert_other_button, "Insert Other", () => { }),
            new TextButton(this._confirm_button, "Confirm", () => {
                target = { ... this._input_state };
                this.Exit();
            }),
            new TextButton(this._cancel_button, "Cancel", () => this.Exit())
        ]
    }
}