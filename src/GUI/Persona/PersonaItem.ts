import { DataManager } from "../../Data";
import { Colors } from "../../Definition";
import { GUISettingScreen, setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawText, ADrawTextButton } from "../Widgets/Common";
import { PersonaImportScreen } from "./PersonaImportScreen";

export class PersonaItem extends AGUIItem {
    private readonly _index: number;
    private readonly _rect: IRect;

    private readonly _import_rect: IRect;
    private readonly _activated_img_pos: IPoint
    private readonly _delete_rect: IRect;
    private readonly _name_point: IPoint;

    private readonly _parent: GUISettingScreen | null;

    constructor(parent: GUISettingScreen | null, index: number, rect: IRect) {
        super();
        this._index = index;
        this._rect = rect;
        this._parent = parent;

        const centerX = this._rect.x + this._rect.width / 2;
        const centerY = this._rect.y + this._rect.height / 2;

        const fontSize = 36;

        const upperPartHeight = Math.max(this._rect.height * 0.618, fontSize);
        const upperPartCenterY = this._rect.y + upperPartHeight / 2;
        const lowerPartCenterY = upperPartCenterY + this._rect.height / 2;

        const verticalSpacing = Math.min(this._rect.height * 0.1, 10);
        const buttonWidth = Math.max(this._rect.width * 0.8, 120);
        const buttonHeight = Math.max(this._rect.height * 0.1, 60);

        const baseButtonX = centerX - buttonWidth / 2;
        const baseButtonY = lowerPartCenterY - buttonHeight;

        this._import_rect = {
            x: baseButtonX,
            y: baseButtonY,
            width: buttonWidth,
            height: buttonHeight
        };

        this._delete_rect = {
            x: baseButtonX,
            y: baseButtonY + (buttonHeight + verticalSpacing),
            width: buttonWidth,
            height: buttonHeight
        };

        this._activated_img_pos = {
            x: centerX - 30,
            y: baseButtonY + verticalSpacing + buttonHeight
        }

        this._name_point = {
            x: centerX,
            y: upperPartCenterY - fontSize / 2
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

        const persona = DataManager.instance.data.personalities[this._index];

        const now = Date.now();
        if (this._focusState.lastUpdate === 0) this._focusState.lastUpdate = now;
        const delta = now - this._focusState.lastUpdate;
        this._focusState.lastUpdate = now;

        const expand_margin = 10 * (1 - this._focusState.value);
        const adjusted_rect = {
            x: this._rect.x + expand_margin,
            y: this._rect.y + expand_margin,
            width: this._rect.width - expand_margin * 2,
            height: this._rect.height - expand_margin * 2
        };

        let bgcolor = 'White';

        if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, adjusted_rect)) {
            this._focusState.state = 'focused';
            this._focusState.value = Math.min(1, this._focusState.value + delta / 100);
            bgcolor = Colors.Hover;
        }
        else {
            this._focusState.state = 'idle';
            this._focusState.value = Math.max(0, this._focusState.value - delta / 100);
        }

        if (persona && DataManager.active_personality === persona) {
            this._focusState.state = 'active';
            if (bgcolor === 'White') bgcolor = Colors.Active;
        }

        if (persona) {
            const mouse = { x: MouseX, y: MouseY };

            if (this._focusState.state === 'active') {
                if (WithinRect(mouse, this._import_rect)) bgcolor = Colors.Active;
            } else {
                if (WithinRect(mouse, this._import_rect) || WithinRect(mouse, this._delete_rect)) bgcolor = 'White';
            }

            if (this._focusState.state === 'active') ADrawFramedRect(adjusted_rect, bgcolor, 'Black', 3);
            else ADrawFramedRect(adjusted_rect, bgcolor);

            ADrawText(this._name_point, persona.name, { align: "center" });
            ADrawTextButton(this._import_rect, "Import/Export", hasFocus);

            if (this._focusState.state === 'active')
                DrawImage("Icons/Checked.png", this._activated_img_pos.x, this._activated_img_pos.y);
            else {
                if (this.deleteState === 0) ADrawTextButton(this._delete_rect, "Delete", hasFocus);
                else ADrawTextButton(this._delete_rect, "Confirm?", hasFocus, { idle: 'Pink', hover: 'Red' });
            }
        } else {
            ADrawFramedRect(adjusted_rect, bgcolor, 'DarkGrey');
            ADrawText({ x: this._rect.x + this._rect.width / 2, y: this._rect.y + this._rect.height / 2 }, "Create New", { align: "center" });
        }
    }

    Click(mouse: IPoint): void {
        const persona = DataManager.instance.data.personalities[this._index];

        const expand_margin = 10 * (1 - this._focusState.value);
        const adjusted_rect = {
            x: this._rect.x + expand_margin,
            y: this._rect.y + expand_margin,
            width: this._rect.width - expand_margin * 2,
            height: this._rect.height - expand_margin * 2
        };

        let notdelete = true;

        if (persona) {
            if (WithinRect(mouse, this._import_rect)) {
                setSubscreen(new PersonaImportScreen(this._parent, this._index));
            } else if (WithinRect(mouse, this._delete_rect)) {
                if (this.deleteState === 0) {
                    this.deleteState = 1;
                } else {
                    DataManager.instance.data.personalities[this._index] = undefined;
                    this.deleteState = 0;
                }
                notdelete = false;
            } else if (WithinRect(mouse, adjusted_rect)) {
                if (DataManager.active_personality !== persona)
                    DataManager.active_personality = persona;
            }
        } else {
            if (WithinRect(mouse, adjusted_rect)) {
                DataManager.instance.data.personalities[this._index] = {
                    name: "New Personality",
                    index: this._index,
                    responses: [],
                };
            }
        }

        if (notdelete) this.deleteState = 0;
    }
}