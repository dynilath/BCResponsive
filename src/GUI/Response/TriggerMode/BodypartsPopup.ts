import { DataManager } from "../../../Data";
import { Styles } from "../../../Definition";
import { GetText } from "../../../i18n";
import { IGUIScreen } from "../../GUI";
import { TextRoundButton } from "../../Widgets/Button";
import { ChipsPark } from "../../Widgets/ChipsPark";
import { RoundFramedRect } from "../../Widgets/Rect";
import { Popup } from "../../Widgets/Popup";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";
import { ActivityAreaDisplay } from "./ActivityAreaDisplay";

const DIALOG_CONTENT_HEIGHT = 720;

const TITLE_FONT_SIZE = 36;

const CHIPS_SPACING = 10;
const TOTAL_CHIPS_WIDTH = 600;

export class BodypartsPopup extends Popup {
    private readonly editing: Set<string>;

    constructor(readonly prev: IGUIScreen, readonly source: ResponseMenuState) {
        super(prev);

        const bodypart_metrics = ActivityAreaDisplay.Metrics();

        const expect_bodypart_height = DIALOG_CONTENT_HEIGHT - TITLE_FONT_SIZE - Styles.Dialog.padding * 2 - Styles.Dialog.control_button_height;

        const bodypart_width = bodypart_metrics.width * expect_bodypart_height / bodypart_metrics.height;

        const dialog_content_width = bodypart_width + Styles.Dialog.padding + TOTAL_CHIPS_WIDTH;

        const _dialog = {
            x: Styles.Screen.center_x - dialog_content_width / 2 - Styles.Dialog.padding,
            y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 - Styles.Dialog.padding,
            width: dialog_content_width + Styles.Dialog.padding * 2,
            height: DIALOG_CONTENT_HEIGHT + Styles.Dialog.padding * 2
        };

        const _dialog_title = { x: Styles.Screen.center_x, y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 + TITLE_FONT_SIZE / 2 };

        const _bodypart_selector = {
            x: Styles.Screen.center_x - dialog_content_width / 2,
            y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 + TITLE_FONT_SIZE + Styles.Dialog.padding,
            width: bodypart_width,
            height: expect_bodypart_height
        };

        const _chips_park = {
            x: Styles.Screen.center_x - dialog_content_width / 2 + bodypart_width + Styles.Dialog.padding,
            y: _bodypart_selector.y,
            width: TOTAL_CHIPS_WIDTH,
            height: _bodypart_selector.height - Styles.Dialog.control_button_height - CHIPS_SPACING
        };

        const _chips_value = AssetGroup.map((v, i) => {
            if (!v.Zone) return undefined;
            return {
                text: v.Description,
                value: v.Name
            };
        }).filter(v => v !== undefined) as { text: string, value: string }[];

        this.editing = new Set(source.asActivity(v => v.allow_bodyparts) || _chips_value.map(v => v.value));

        const _chip_clear = {
            x: _chips_park.x + _chips_park.width / 2 - Styles.Dialog.padding / 2 - Styles.Dialog.control_button_width,
            y: _chips_park.y + _chips_park.height + CHIPS_SPACING,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _chip_all = {
            x: _chips_park.x + _chips_park.width / 2 + Styles.Dialog.padding / 2,
            y: _chip_clear.y,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        }

        const _confirm_button = {
            x: Styles.Screen.center_x - Styles.Dialog.padding / 2 - Styles.Dialog.control_button_width,
            y: Styles.Screen.center_y + DIALOG_CONTENT_HEIGHT / 2 - Styles.Dialog.control_button_height,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _cancel_button = {
            x: Styles.Screen.center_x + Styles.Dialog.padding / 2,
            y: _confirm_button.y,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const flip = (v: string) => {
            if (this.editing.has(v)) this.editing.delete(v);
            else this.editing.add(v);
        }

        this.items = [
            new RoundFramedRect(_dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(_dialog_title, GetText("BodypartsPopup::Title"), { align: "center", emphasis: true }),
            new ActivityAreaDisplay(this.editing, _bodypart_selector, flip),
            new ChipsPark(this.editing, _chips_value, _chips_park, flip),
            new TextRoundButton(_chip_clear, GetText("General::Clear"), () => this.editing.clear()),
            new TextRoundButton(_chip_all, GetText("General::AllSet"), () => _chips_value.forEach(v => this.editing.add(v.value))),
            new TextRoundButton(_confirm_button, GetText("General::Confirm"), () => {
                this.source.asActivity(v => {
                    if (this.editing.size === _chips_value.length) v.allow_bodyparts = undefined;
                    else v.allow_bodyparts = [...this.editing]
                });
                DataManager.save();
                this.Exit();
            }),
            new TextRoundButton(_cancel_button, GetText("General::Cancel"), () => this.Exit())
        ]
    }
}