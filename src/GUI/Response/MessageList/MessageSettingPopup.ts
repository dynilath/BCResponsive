import { i18n } from "../../../i18n";
import { IGUIScreen } from "../../GUI";
import { RoundFramedRect } from "../../Widgets/Rect";
import { TextButton, TextRoundButton } from "../../Widgets/Button";
import { BasicText } from "../../Widgets/Text";
import { TextAreaItem } from "../../Widgets/InputText";
import { Popup } from "../../Widgets/Popup";
import { Styles } from "../../../Definition";
import { SegmentButton } from "../../Widgets/SegmentButton";
import { Binding } from "../../Widgets/Binding";

class MessageTypeBinding extends Binding<ResponseMessageType> {
    constructor(readonly message: ResponseMessage) {
        super();
    }
    get value(): ResponseMessageType {
        return this.message.type;
    }
    set value(v: ResponseMessageType) {
        this.message.type = v as ResponseMessageType;
    }
}


const FONT_SIZE = 36;
const INPUT_WIDTH = 800;
const INPUT_HEIGHT = 500;
const SPACING = 15;

export class MessageSettinPopup extends Popup {
    private _input_state: ResponseMessage;
    private _text_input: TextAreaItem;

    private _confirm_callback: (message: ResponseMessage) => void;
    private _delete_callback: (message: ResponseMessage) => void;

    constructor(readonly prev: IGUIScreen | null, readonly target: ResponseMessage, readonly confirm: (message: ResponseMessage) => void, readonly del: (message: ResponseMessage) => void) {
        super(prev);

        if (target) this._input_state = { ...target };
        else this._input_state = { type: "message", content: i18n("Default::ExampleMessage") };

        this._confirm_callback = confirm;
        this._delete_callback = del;

        const dialogTotalWidth = Math.max(INPUT_WIDTH, Styles.Dialog.control_button_width * 3 + SPACING * 2);
        const dialogTotalHeight = FONT_SIZE + INPUT_HEIGHT + Styles.Dialog.control_button_height * 2 + SPACING * 3;
        const _dialog = {
            x: Styles.Screen.center_x - dialogTotalWidth / 2 - Styles.Dialog.padding,
            y: Styles.Screen.center_y - dialogTotalHeight / 2 - Styles.Dialog.padding,
            width: dialogTotalWidth + Styles.Dialog.padding * 2,
            height: dialogTotalHeight + Styles.Dialog.padding * 2
        };

        const _title = { x: Styles.Screen.center_x, y: _dialog.y + Styles.Dialog.padding + FONT_SIZE / 2 };

        const _type_segbutton = {
            x: Styles.Screen.center_x - dialogTotalWidth / 2,
            y: Styles.Screen.center_y - dialogTotalHeight / 2 + FONT_SIZE + SPACING,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        };

        const _insert_me_button = {
            x: Styles.Screen.center_x + dialogTotalWidth / 2 - Styles.Dialog.control_button_width * 2 - SPACING,
            y: _type_segbutton.y,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        };

        const _insert_other_button = {
            x: Styles.Screen.center_x + dialogTotalWidth / 2 - Styles.Dialog.control_button_width,
            y: _type_segbutton.y,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        };

        const _input = {
            x: Styles.Screen.center_x - INPUT_WIDTH / 2,
            y: _type_segbutton.y + SPACING + Styles.Dialog.control_button_height,
            width: INPUT_WIDTH, height: INPUT_HEIGHT
        };

        // left align delete button
        const _delete_button = {
            x: Styles.Screen.center_x - dialogTotalWidth / 2,
            y: _input.y + INPUT_HEIGHT + SPACING,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        };

        // right align confirm and cancel button
        const _confirm_button = {
            x: Styles.Screen.center_x + dialogTotalWidth / 2 - Styles.Dialog.control_button_width * 2 - SPACING,
            y: _input.y + INPUT_HEIGHT + SPACING,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        }

        const _cancel_button = {
            x: _confirm_button.x + Styles.Dialog.control_button_width + SPACING,
            y: _input.y + INPUT_HEIGHT + SPACING,
            width: Styles.Dialog.control_button_width, height: Styles.Dialog.control_button_height
        };

        this._text_input = new TextAreaItem(_input, "InputMessage", { text: this._input_state.content });

        this.items = [
            new RoundFramedRect(_dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(_title, i18n("MessagePopup::EditMessage"), { align: "center", emphasis: true }),
            this._text_input,
            new SegmentButton<ResponseMessageType>({
                text: [
                    { display: i18n("MessagePopup::Type::message"), value: "message" },
                    { display: i18n("MessagePopup::Type::action"), value: "action" }
                ],
                binding: new MessageTypeBinding(this._input_state)
            }, _type_segbutton),
            new TextRoundButton(_insert_me_button, i18n("MessagePopup::InsertMe"), () => {
                this._text_input.InsertAtCursor("{me}");
            }),
            new TextRoundButton(_insert_other_button, i18n("MessagePopup::InsertOther"), () => {
                this._text_input.InsertAtCursor("{other}");
            }),
            new TextRoundButton(_delete_button, i18n("General::Delete"), () => {
                this.Exit();
                this._delete_callback(this._input_state);
            }),
            new TextRoundButton(_confirm_button, i18n("General::Confirm"), () => {
                this._input_state.content = this._text_input.text;
                this._confirm_callback(this._input_state);
                this.Exit();
            }),
            new TextRoundButton(_cancel_button, i18n("General::Cancel"), () => this.Exit())
        ]
    }
}