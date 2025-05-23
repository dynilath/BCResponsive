import { DataManager } from "../../Data";
import { Styles } from "../../Definition";
import { i18n } from "../../i18n";
import { GUISetting, IGUIScreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawCricleTextButton, ADrawRoundRect, ADrawTextFit } from "../Widgets/Common";
import { PersonaImportScreen } from "./PersonaImportScreen";
import { PersonaRemamePopup } from "./PersonaRenamePopup";

const EXPAND_MARGIN = 10;

export class PersonaItem extends AGUIItem {

    private readonly _rename_rect: IRect;
    private readonly _import_rect: IRect;
    private readonly _delete_rect: IRect;
    private readonly _name_rect: IRect;

    private readonly _new_rect: IRect;

    constructor(readonly parent: IGUIScreen | null, readonly index: number, readonly rect: IRect) {
        super();

        const button_width = Math.max(rect.width * 0.8, 120);
        const button_height = Math.max(rect.height * 0.1, 60);
        const spacing = Math.min(rect.height * 0.1, 10);

        const center_x = rect.x + rect.width / 2;
        const center_y = rect.y + rect.height / 2;

        const text_area_height = 60;

        const lower_part_height = button_height * 3 + spacing * 2;

        const upper_center_y = rect.y + (rect.height - lower_part_height - spacing) / 2;

        this._rename_rect = {
            x: rect.x + rect.width / 2 - button_width / 2,
            y: rect.y + rect.height - lower_part_height - spacing - EXPAND_MARGIN,
            width: button_width,
            height: button_height
        };

        this._import_rect = {
            x: this._rename_rect.x,
            y: this._rename_rect.y + (button_height + spacing),
            width: button_width,
            height: button_height
        };

        this._delete_rect = {
            x: this._import_rect.x,
            y: this._import_rect.y + (button_height + spacing),
            width: button_width,
            height: button_height
        };

        this._name_rect = {
            x: rect.x + spacing,
            y: upper_center_y - text_area_height / 2,
            width: rect.width - spacing * 2,
            height: text_area_height
        };

        this._new_rect = {
            x: rect.x + spacing,
            y: rect.y + rect.height / 2 - text_area_height / 2,
            width: rect.width - spacing * 2,
            height: text_area_height
        };
    }

    private _focusState: {
        state: 'idle' | 'focused' | 'active',
        value: number,
        lastUpdate: number
    } = {
            state: 'idle',
            value: 0,
            lastUpdate: 0
        };

    private deleteState: number = 0;

    Draw(hasFocus: boolean) {
        MainCanvas.textAlign = "center";

        const persona = DataManager.instance.data.personalities[this.index];

        const now = Date.now();
        if (this._focusState.lastUpdate === 0) this._focusState.lastUpdate = now;
        const delta = now - this._focusState.lastUpdate;
        this._focusState.lastUpdate = now;

        const expand_margin = EXPAND_MARGIN * (1 - this._focusState.value);
        const adjusted_rect = {
            x: this.rect.x + expand_margin,
            y: this.rect.y + expand_margin,
            width: this.rect.width - expand_margin * 2,
            height: this.rect.height - expand_margin * 2
        };

        const mouse = { x: MouseX, y: MouseY };

        if (hasFocus && WithinRect(mouse, adjusted_rect)) {
            this._focusState.value = Math.min(1, this._focusState.value + delta / 100);
            if (!persona) this._focusState.state = 'focused';
            else if (DataManager.active_personality !== persona && WithinRect(mouse, this._delete_rect)) { }
            else if (WithinRect(mouse, this._rename_rect)) { }
            else if (WithinRect(mouse, this._import_rect)) { }
            else this._focusState.state = 'focused';
        }
        else {
            this._focusState.state = 'idle';
            this._focusState.value = Math.max(0, this._focusState.value - delta / 100);
        }

        if (persona) {
            if (DataManager.active_personality === persona) {
                ADrawRoundRect(adjusted_rect, Styles.Dialog.roundRadius, { fill: Styles.SegmentButton.active, stroke: "none" });
            }

            if (this._focusState.state === 'focused')
                ADrawRoundRect(adjusted_rect, Styles.Dialog.roundRadius, { fill: Styles.SegmentButton.hover });
            else
                ADrawRoundRect(adjusted_rect, Styles.Dialog.roundRadius);

            ADrawTextFit(this._name_rect, persona.name);
            ADrawCricleTextButton(this._rename_rect, i18n("PersonaMenu::EditName"), hasFocus);
            ADrawCricleTextButton(this._import_rect, i18n("PersonaMenu::Import"), hasFocus);

            if (DataManager.active_personality !== persona) {
                if (this.deleteState === 0) ADrawCricleTextButton(this._delete_rect, i18n("PersonaMenu::Delete"), hasFocus);
                else ADrawCricleTextButton(this._delete_rect, i18n("PersonaMenu::Confirm?"), hasFocus, { idle: 'Pink', hover: 'Red' });
            }
        } else {
            if (this._focusState.state === 'focused') ADrawRoundRect(adjusted_rect, Styles.Dialog.roundRadius, { fill: Styles.SegmentButton.hover, stroke: 'DarkGrey' });
            else ADrawRoundRect(adjusted_rect, Styles.Dialog.roundRadius, { stroke: 'DarkGrey' });
            ADrawTextFit(this._new_rect, i18n("PersonaMenu::CreateNew"));
        }
    }

    Click(mouse: IPoint): void {
        const persona = DataManager.instance.data.personalities[this.index];

        const expand_margin = 10 * (1 - this._focusState.value);
        const adjusted_rect = {
            x: this.rect.x + expand_margin,
            y: this.rect.y + expand_margin,
            width: this.rect.width - expand_margin * 2,
            height: this.rect.height - expand_margin * 2
        };

        let notdelete = true;

        if (persona) {
            if (WithinRect(mouse, this._rename_rect)) {
                GUISetting.setScreen(new PersonaRemamePopup(this.parent, persona, n => {
                    persona.name = n;
                    DataManager.save();
                }));
            }
            else if (WithinRect(mouse, this._import_rect)) {
                GUISetting.setScreen(new PersonaImportScreen(this.parent, this.index));
            }
            else if (WithinRect(mouse, this._delete_rect)) {
                if (this.deleteState === 0) {
                    this.deleteState = 1;
                } else {
                    DataManager.instance.data.personalities[this.index] = undefined;
                    this.deleteState = 0;
                }
                notdelete = false;
            } else if (WithinRect(mouse, adjusted_rect)) {
                if (DataManager.active_personality !== persona) {
                    DataManager.active_personality = persona;
                    DataManager.save();
                }
            }
        } else {
            if (WithinRect(mouse, adjusted_rect)) {
                DataManager.instance.data.personalities[this.index] = {
                    name: i18n("Default::NewPersonality"),
                    index: this.index,
                    responses: [],
                    blackList: [],
                };
                DataManager.save();
            }
        }

        if (notdelete) this.deleteState = 0;
    }
}
