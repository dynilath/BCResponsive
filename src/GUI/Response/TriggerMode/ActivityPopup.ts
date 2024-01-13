import { DefaultValueV1TriggerActivities } from "../../../Data/V1";
import { Styles } from "../../../Definition";
import { GetText } from "../../../i18n";
import { GUISettingScreen } from "../../GUI";
import { AGUIItem, IRect } from "../../Widgets/AGUI";
import { TextRoundButton } from "../../Widgets/Button";
import { ChipsPark } from "../../Widgets/ChipsPark";
import { RoundFramedRect } from "../../Widgets/Common";
import { Popup } from "../../Widgets/Popup";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";

const TITLE_FONT_SIZE = 36;

const FILTER_BUTTONS_WIDTH = 200;
const FILTER_BUTTONS_HEIGHT = 50;
const FILTER_BUTTONS_SPACING = 10;

const TOTAL_CHIPS_WIDTH = 1000;

const DIALOG_CONTENT_HEIGHT = 720;

export class ActivityPopup extends Popup {

    private readonly source: ResponseMenuState;
    private readonly editing: Set<string>;

    constructor(prev: GUISettingScreen, source: ResponseMenuState) {
        super(prev);
        this.source = source;

        const _title = {
            x: Styles.Screen.center_x,
            y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 + TITLE_FONT_SIZE / 2
        };

        const dialog_content_width = Math.max(
            FILTER_BUTTONS_WIDTH + Styles.Dialog.padding + TOTAL_CHIPS_WIDTH,
            Styles.Dialog.control_button_width * 2 + Styles.Dialog.padding);

        const _filter_button_base = {
            x: Styles.Screen.center_x - dialog_content_width / 2,
            y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 + TITLE_FONT_SIZE + Styles.Dialog.padding
        };

        const _chips_park = {
            x: _filter_button_base.x + FILTER_BUTTONS_WIDTH + Styles.Dialog.padding,
            y: _filter_button_base.y,
            width: TOTAL_CHIPS_WIDTH,
            height: DIALOG_CONTENT_HEIGHT - TITLE_FONT_SIZE - Styles.Dialog.padding * 2 - Styles.Dialog.control_button_height
        };

        const _chips_value = ActivityFemale3DCG.map(v => {
            const desc = ActivityDictionaryText(`Activity${v.Name}`);
            if (desc.length > 25) return undefined; // MISSING DESCRIPTION
            return {
                text: desc,
                value: v.Name
            };
        }).filter(v => v !== undefined) as { text: string, value: string }[];
        this.editing = new Set(this.source.asActivity(v => v.allow_activities) || _chips_value.map(v => v.value));

        const _dialog_confirm = {
            x: Styles.Screen.center_x - Styles.Dialog.padding / 2 - Styles.Dialog.control_button_width,
            y: Styles.Screen.center_y + DIALOG_CONTENT_HEIGHT / 2 - Styles.Dialog.control_button_height,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _dialog_cancel = {
            x: Styles.Screen.center_x + Styles.Dialog.padding / 2,
            y: _dialog_confirm.y,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _dialog = {
            x: Styles.Screen.center_x - dialog_content_width / 2 - Styles.Dialog.padding,
            y: Styles.Screen.center_y - DIALOG_CONTENT_HEIGHT / 2 - Styles.Dialog.padding,
            width: dialog_content_width + Styles.Dialog.padding * 2,
            height: DIALOG_CONTENT_HEIGHT + Styles.Dialog.padding * 2
        };

        let filter_button_y = _filter_button_base.y;
        const nfb = (y: number) => y + FILTER_BUTTONS_HEIGHT + FILTER_BUTTONS_SPACING;
        const _filter_all = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };
        filter_button_y = nfb(filter_button_y);
        const _filter_clear = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };
        filter_button_y = nfb(filter_button_y);
        filter_button_y = nfb(filter_button_y);
        const _filter_pain = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };
        filter_button_y = nfb(filter_button_y);
        const _filter_tickle = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };
        filter_button_y = nfb(filter_button_y);
        const _filter_masturbate = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };
        filter_button_y = nfb(filter_button_y);
        const _filter_feet = {
            x: _filter_button_base.x,
            y: filter_button_y,
            width: FILTER_BUTTONS_WIDTH,
            height: FILTER_BUTTONS_HEIGHT
        };

        const flip = (v: string) => {
            if (this.editing.has(v)) this.editing.delete(v);
            else this.editing.add(v);
        }

        const flipList = (vs: string[]) => {
            if (vs.every(a => this.editing.has(a))) vs.forEach(a => this.editing.delete(a));
            else vs.forEach(a => this.editing.add(a));
        }

        this._items = [
            new RoundFramedRect(_dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(_title, GetText("ActivityPopup::Title"), { align: "center" }),
            new ChipsPark(this.editing, _chips_value, _chips_park, flip),
            new TextRoundButton(_filter_clear, GetText("General::Clear"), () => this.editing.clear()),
            new TextRoundButton(_filter_all, GetText("General::AllSet"), () => _chips_value.forEach(v => this.editing.add(v.value))),
            new TextRoundButton(_filter_pain, GetText("ActivityPopup::Pain"), () => flipList(DefaultValueV1TriggerActivities.pain)),
            new TextRoundButton(_filter_tickle, GetText("ActivityPopup::Tickle"), () => flipList(DefaultValueV1TriggerActivities.tickle)),
            new TextRoundButton(_filter_masturbate, GetText("ActivityPopup::Masturbate"), () => flipList(DefaultValueV1TriggerActivities.masturbate)),
            new TextRoundButton(_filter_feet, GetText("ActivityPopup::Feet"), () => flipList(["MassageFeet", "Step", "Kick", "MasturbateFoot"])),
            new TextRoundButton(_dialog_confirm, GetText("General::Confirm"), () => {
                this.source.asActivity(v => {
                    if (this.editing.size === _chips_value.length) v.allow_activities = undefined;
                    else v.allow_activities = [...this.editing]
                });
                this.Exit();
            }),
            new TextRoundButton(_dialog_cancel, GetText("General::Cancel"), () => this.Exit()),
        ]
    }
}