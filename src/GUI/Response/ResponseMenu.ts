import { isTriggerActivity } from "../../Data";
import { Colors } from "../../Definition";
import { GUISettingScreen } from "../GUI";
import { AGUIItem, AGUIScreen, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawTextFit, AFillRect, AStrokeRect, BasicText, ExitButton, TitleText } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";
import { TriggerName } from "./TriggerName";
import { TriggerTab } from "./TriggerTab";

export class TriggerSetting extends AGUIScreen {
    private readonly _state: ResponseMenuState;
    constructor(prev: GUISettingScreen | null = null, persona: ResponsivePersonality) {
        const CommonFontSize = 36;

        const MenuBaseY = 200;
        const MenuBaseItemHeight = 70;

        const TriggerTabBaseX = 200;

        const TriggerInfoBaseX = 550;
        const TriggerInfoNextX = TriggerInfoBaseX + 150;
        const TriggerInfoHeight = 60;

        super(prev);
        this._state = new ResponseMenuState(persona);
        this._items = [
            new TriggerTab(this._state, { x: TriggerTabBaseX, y: MenuBaseY, width: 300, height: 660 }),
            new ExitButton(() => this.Exit()),
            new TitleText(),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + TriggerInfoHeight / 2 }, "Name:"),
            new TriggerName(this._state, { x: TriggerInfoNextX, y: MenuBaseY, width: 450, height: TriggerInfoHeight }),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + MenuBaseItemHeight + TriggerInfoHeight / 2 }, "Mode:"),
            new TriggerMode(this._state, { x: TriggerInfoNextX, y: MenuBaseY + MenuBaseItemHeight, width: 450, height: TriggerInfoHeight }),
            new ActivityAreaInfo(this._state, { x: TriggerInfoBaseX, y: MenuBaseY + MenuBaseItemHeight * 2 + TriggerInfoHeight / 2, width: 450, height: 450 }),
        ];
    }
}
export class TriggerMode extends AGUIItem {
    private readonly _state: ResponseMenuState;
    private readonly _rect: IRect;
    private readonly _sect: IRect[];
    private readonly Modes: ResponsiveTriggerMode[] = ['activity', 'orgasm', 'spicer'];

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        const sectWidth = rect.width / this.Modes.length;
        this._sect = Array.from({ length: this.Modes.length }, (_, index) => {
            return {
                x: rect.x + sectWidth * index,
                y: rect.y,
                width: sectWidth,
                height: rect.height
            }
        });
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null) return;

        const mode = this._state.activeItem.trigger.mode;

        AFillRect(this._rect, "White");
        if (hasFocus) this._sect.forEach((v, i) => {
            if (WithinRect({ x: MouseX, y: MouseY }, v)) AFillRect(v, Colors.Hover);
            else if (mode === this.Modes[i]) AFillRect(v, Colors.Active);
        });
        this._sect.forEach((v, i) => { AStrokeRect(v); ADrawTextFit(v, this.Modes[i]); });
    }

    Click(mouse: IPoint): void {
        if (this._state.activeItem === null) return;

        this._sect.forEach((v, i) => {
            if (WithinRect(mouse, v)) {
                if (this._state.activeItem !== null)
                    this._state.activeItem.trigger.mode = this.Modes[i];
            }
        });
    }
}

export class ActivityAreaInfo extends AGUIItem {
    private readonly _state: ResponseMenuState;
    private readonly _rect: IRect;
    private readonly _translate: IPoint;
    private readonly _scale: number;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        const expectRange = AssetGroup.map(i => i.Zone).flat().reduce((prev, cur) => {
            if (!cur) return prev;
            return {
                left: Math.min(prev.left, cur[0]),
                top: Math.min(prev.top, cur[1]),
                bottom: Math.max(prev.bottom, cur[0] + cur[2]),
                right: Math.max(prev.right, cur[1] + cur[3])
            }
        }, { left: 2000, top: 1000, bottom: 0, right: 0 });
        const expectWH = { width: expectRange.right - expectRange.left, height: expectRange.bottom - expectRange.top };
        const expectRatio = expectWH.width / expectWH.height;
        const givenRatio = rect.width / rect.height;

        if (expectRatio < givenRatio) {
            const tX = rect.x + rect.width / 2 - expectWH.width / 2;
            this._scale = rect.height / expectWH.height;
            this._translate = { x: tX - expectRange.left * this._scale, y: rect.y - expectRange.top * this._scale };
        } else {
            const tY = rect.y + rect.height / 2 - expectWH.height / 2;
            this._scale = rect.width / expectWH.width;
            this._translate = { x: rect.x - expectRange.left * this._scale, y: tY - expectRange.top * this._scale };
        }
    }

    RectTuple2Rect(rect: [number, number, number, number]): IRect {
        return {
            x: rect[0] * this._scale + this._translate.x,
            y: rect[1] * this._scale + this._translate.y,
            width: rect[2] * this._scale,
            height: rect[3] * this._scale
        };
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerActivity(this._state.activeItem.trigger)) return;

        const allowParts = this._state.activeItem.trigger.allow_bodyparts;

        AssetGroup.forEach((v, i) => {
            if (!v.Zone) return;
            const isHover = v.Zone.some(v => WithinRect({ x: MouseX, y: MouseY }, this.RectTuple2Rect(v)));
            const isActive = allowParts && allowParts.includes(v.Name);
            const color = isHover ? Colors.Hover : isActive ? Colors.Active : "White";
            v.Zone.forEach((v, i) => {
                ADrawFramedRect(this.RectTuple2Rect(v), color, "Black");
            });
        });
    }
}

export class ActivityModeInfo extends AGUIItem {
    private _state: ResponseMenuState;
    private _rect: IRect;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerActivity(this._state.activeItem.trigger)) return;
    }
}