import { MaxNameLength, Styles } from "../../Definition";
import { i18n } from "../../i18n";
import { IGUIScreen } from "../GUI";
import { TextRoundButton } from "../Widgets/Button";
import { RoundFramedRect } from "../Widgets/Rect";
import { TextInput } from "../Widgets/InputText";
import { Popup } from "../Widgets/Popup";
import { BasicText } from "../Widgets/Text";

const FONT_SIZE = 36;
const INPUT_HEIGHT = 100;
const INPUT_WIDTH = 600;

export class PersonaRemamePopup extends Popup {
    private _input: TextInput;

    constructor(readonly prev: IGUIScreen | null, readonly target: ResponsivePersonality, readonly confirm: (name: string) => void) {
        super(prev);

        const dialog_total_width = Math.max(INPUT_WIDTH, Styles.Dialog.control_button_width * 2 + Styles.Dialog.padding);
        const dialog_total_height = FONT_SIZE + INPUT_HEIGHT + Styles.Dialog.control_button_height + Styles.Dialog.padding * 2;

        const _title = {
            x: Styles.Screen.center_x,
            y: Styles.Screen.center_y - dialog_total_height / 2 + FONT_SIZE / 2
        }

        const _input = {
            x: Styles.Screen.center_x - INPUT_WIDTH / 2,
            y: _title.y + FONT_SIZE / 2 + Styles.Dialog.padding,
            width: INPUT_WIDTH,
            height: INPUT_HEIGHT
        }

        const _confirm_button = {
            x: Styles.Screen.center_x - Styles.Dialog.padding / 2 - Styles.Dialog.control_button_width,
            y: _input.y + INPUT_HEIGHT + Styles.Dialog.padding,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        }

        const _cancel_button = {
            x: Styles.Screen.center_x + Styles.Dialog.padding / 2,
            y: _confirm_button.y,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        }

        const _dialog = {
            x: Styles.Screen.center_x - dialog_total_width / 2 - Styles.Dialog.padding,
            y: Styles.Screen.center_y - dialog_total_height / 2 - Styles.Dialog.padding,
            width: dialog_total_width + Styles.Dialog.padding * 2,
            height: dialog_total_height + Styles.Dialog.padding * 2
        }

        this._input = new TextInput(_input, "PersonaRenameInput", target.name);

        this.items = [
            new RoundFramedRect(_dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(_title, i18n("RenamePopup::PersonaName::Title"), { align: "center" }),
            this._input,
            new TextRoundButton(_confirm_button, i18n("General::Confirm"), () => {
                confirm(this._input.text.substring(0, MaxNameLength));
                this.Exit();
            }),
            new TextRoundButton(_cancel_button, i18n("General::Cancel"), () => {
                this.Exit();
            }),
        ];

    }
}