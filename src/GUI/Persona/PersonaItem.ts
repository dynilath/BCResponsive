import { DataManager } from "../../Data";
import { GUISettingScreen, setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawText, ADrawTextButton } from "../Widgets/Common";
import { PersonaImportScreen } from "./PersonaImportScreen";

export class PersonaItem extends AGUIItem {
    private _index: number;
    private _rect: IRect;

    private _import_rect: IRect;
    private _activated_img_pos: IPoint
    private _delete_rect: IRect;
    private _name_point: IPoint;

    private _parent: () => GUISettingScreen | null;

    constructor(parent: () => GUISettingScreen | null, index: number, rect: IRect) {
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
        const align = MainCanvas.textAlign;
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

        if (persona && DataManager.active_personality === persona) {
            this._focusState.state = 'active';
        } else if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, adjusted_rect))
            this._focusState.state = 'focused';
        else this._focusState.state = 'idle';


        if (this._focusState.state === 'idle') {
            this._focusState.value = Math.max(0, this._focusState.value - delta / 100);
        } else if (this._focusState.state === 'focused') {
            this._focusState.value = Math.min(1, this._focusState.value + delta / 100);
        } else if (this._focusState.state === 'active') {
            this._focusState.value = 0.6;
        }

        if (persona) {
            if (this._focusState.state === 'active')
                ADrawFramedRect(adjusted_rect, 'White', 'Black', 4);
            else ADrawFramedRect(adjusted_rect, 'White');

            ADrawText(this._name_point, persona.name);
            ADrawTextButton(this._import_rect, "Import/Export", hasFocus);

            if (this._focusState.state === 'active')
                DrawImage("Icons/Checked.png", this._activated_img_pos.x, this._activated_img_pos.y);
            else {
                if (this.deleteState === 0) ADrawTextButton(this._delete_rect, "Delete", hasFocus);
                else ADrawTextButton(this._delete_rect, "Confirm?", hasFocus, { idle: 'Pink', hover: 'Red' });
            }
        } else {
            ADrawFramedRect(adjusted_rect, 'White', 'DarkGray');
            ADrawText({ x: this._rect.x + this._rect.width / 2, y: this._rect.y + this._rect.height / 2 }, "Create New");
        }
        MainCanvas.textAlign = align;
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
                setSubscreen(new PersonaImportScreen(this._parent(), this._index));
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
