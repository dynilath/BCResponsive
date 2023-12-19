import { isTriggerActivity, isTriggerSpicer } from "../../Data";
import { Colors } from "../../Definition";
import { GUISettingScreen } from "../GUI";
import { AGUIItem, AGUIScreen, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawText, ADrawTextButton, ADrawTextFit, AFillRect, AStrokeRect, BasicText, ExitButton, TitleText } from "../Widgets/Common";
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
        const TriggerInfoNextWidth = 450;
        const TriggerInfoHeight = 60;

        const TriggerMessageBaseX = 1200;
        const TriggerMessageWidth = 600;

        super(prev);
        this._state = new ResponseMenuState(persona);
        this._items = [
            new TriggerTab(this._state, { x: TriggerTabBaseX, y: MenuBaseY, width: 300, height: 660 }),
            new ExitButton(() => this.Exit()),
            new TitleText(),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + TriggerInfoHeight / 2 }, "Name:"),
            new TriggerName(this._state, { x: TriggerInfoNextX, y: MenuBaseY, width: TriggerInfoNextWidth, height: TriggerInfoHeight }),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + MenuBaseItemHeight + TriggerInfoHeight / 2 }, "Mode:"),
            new TriggerMode(this._state, { x: TriggerInfoNextX, y: MenuBaseY + MenuBaseItemHeight, width: TriggerInfoNextWidth, height: TriggerInfoHeight }),
            new ActivityModeInfo(this._state, {
                x: TriggerInfoBaseX,
                y: MenuBaseY + MenuBaseItemHeight * 2 + TriggerInfoHeight / 2,
                width: TriggerInfoNextWidth + TriggerInfoNextX - TriggerInfoBaseX,
                height: 450
            }),
            new SpicerModeInfo(this._state, {
                x: TriggerInfoBaseX,
                y: MenuBaseY + MenuBaseItemHeight * 2 + TriggerInfoHeight / 2,
                width: TriggerInfoNextWidth + TriggerInfoNextX - TriggerInfoBaseX,
                height: 450
            }),
            new ResponseMessageList(this._state, {
                x: TriggerMessageBaseX,
                y: MenuBaseY,
                width: TriggerMessageWidth,
                height: 660
            })
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

export class ResponseMessageList extends AGUIItem {
    private readonly _state: ResponseMenuState;

    private readonly _itemRects: IRect[];

    private readonly _prevButton: IRect;
    private readonly _nextButton: IRect;
    private readonly _pageText: IPoint;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;

        const itemHeight = 60;
        const spacing = 10;

        const itemWidth = rect.width;
        const itemBaseY = rect.y + spacing + itemHeight;
        const itemBaseHeight = itemHeight;

        this._itemRects = Array.from({ length: 8 }, (_, index) => {
            return {
                x: rect.x,
                y: itemBaseY + (itemBaseHeight + spacing) * index,
                width: itemWidth,
                height: itemBaseHeight
            }
        });

        this._prevButton = { x: rect.x, y: rect.y, width: itemHeight, height: itemHeight };
        this._nextButton = { x: rect.x + rect.width - itemHeight, y: rect.y, width: itemHeight, height: itemHeight };
        this._pageText = { x: rect.x + rect.width / 2, y: rect.y + 30 };
    }

    private curPage: number = 0;
    private maxPage: number = 0;

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null) return;

        const messages = this._state.activeItem.messages;
        const itemPerPage = this._itemRects.length;

        this.maxPage = Math.ceil(messages.length / itemPerPage) - 1;
        this.curPage = Math.min(this.curPage, this.maxPage);

        this._itemRects.forEach((v, i) => {
            const targetIndex = this.curPage * itemPerPage + i;
            if (messages.length > targetIndex && targetIndex >= 0) {
                const message = messages[targetIndex];
                ADrawTextButton({ x: v.x, y: v.y, width: 100, height: v.height }, message.type, hasFocus);
                ADrawTextButton({ x: v.x + 120, y: v.y, width: v.width - 120, height: v.height }, message.content, hasFocus);
            } else if (messages.length === targetIndex || messages.length === 0) {
                ADrawTextButton(v, "New Responses", hasFocus, { stroke: "DarkGrey" });
            }
        });

        if (hasFocus) {
            ADrawTextButton(this._prevButton, "<", hasFocus && this.curPage > 0, { stroke: hasFocus && this.curPage > 0 ? "Black" : "DarkGrey" });
            ADrawTextButton(this._nextButton, ">", hasFocus && this.curPage < this.maxPage, { stroke: hasFocus && this.curPage < this.maxPage ? "Black" : "DarkGrey" });
        }
        ADrawText(this._pageText, `${this.curPage + 1}/${this.maxPage + 1}`, { align: "center" });
    }
}


export class ActivityAreaInfo extends AGUIItem {
    private readonly _state: ResponseMenuState;
    private readonly _translate: IPoint;
    private readonly _scale: number;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;

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
            const color = (() => {
                if (isHover) return Colors.Hover;
                if (isActive) return Colors.Active;
                return "White"
            })();
            v.Zone.forEach((v, i) => {
                ADrawFramedRect(this.RectTuple2Rect(v), color, "Black");
            });
        });
    }
}

export class ActivityModeInfo extends AGUIItem {
    private _state: ResponseMenuState;
    private _rect: IRect;

    private readonly _activity_text: IPoint;
    private readonly _activity_state: IRect;

    private readonly _bodypart_text: IPoint;
    private readonly _bodypart_state: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        const itemHeight = 60;
        const spacing = 10;

        this._activity_text = { x: rect.x, y: rect.y + itemHeight / 2 };
        this._activity_state = { x: rect.x, y: rect.y + spacing + itemHeight, width: rect.width, height: itemHeight };

        this._bodypart_text = { x: rect.x, y: rect.y + (spacing + itemHeight) * 2 + itemHeight / 2 };
        this._bodypart_state = { x: rect.x, y: rect.y + (spacing + itemHeight) * 3, width: rect.width, height: itemHeight };

        this._allow_ids_text = { x: rect.x, y: rect.y + (spacing + itemHeight) * 4 + itemHeight / 2 };
        this._allow_ids_state = { x: rect.x, y: rect.y + (spacing + itemHeight) * 5, width: rect.width, height: itemHeight };
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerActivity(this._state.activeItem.trigger)) return;
        ADrawText(this._activity_text, "On Activity:");
        ADrawTextButton(this._activity_state, this._state.activeItem.trigger.allow_activities.join(', '), hasFocus);

        ADrawText(this._bodypart_text, "On Bodyparts:");
        ADrawTextButton(this._bodypart_state, (v => v ? v.join(", ") : "All Bodyparts")(this._state.activeItem.trigger.allow_bodyparts), hasFocus);

        ADrawText(this._allow_ids_text, "On Members:");
        ADrawTextButton(this._allow_ids_state, (v => v ? v.join(", ") : "All IDs")(this._state.activeItem.trigger.allow_ids), hasFocus);
    }
}

export class SpicerModeInfo extends AGUIItem {
    private _state: ResponseMenuState;

    private readonly _min_arousal_text: IPoint;
    private readonly _min_arousal_input: IRect;

    private readonly _max_arousal_text: IPoint;
    private readonly _max_arousal_input: IRect;

    private readonly _apply_fav_text: IPoint;
    private readonly _apply_fav_switch: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;

        const itemHeight = 60;
        const spacing = 10;
        const arousalTextWidth = 250;

        let lineY = rect.y;
        const nl = (v: number) => v + spacing + itemHeight;

        this._min_arousal_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._min_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: itemHeight };

        lineY = nl(lineY);
        this._max_arousal_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._max_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: itemHeight };

        lineY = nl(lineY);
        this._apply_fav_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._apply_fav_switch = { x: rect.x + + rect.width - itemHeight * 2, y: lineY, width: itemHeight * 2, height: itemHeight };

        lineY = nl(lineY);
        this._allow_ids_text = { x: rect.x, y: lineY + itemHeight / 2 };
        lineY = nl(lineY);
        this._allow_ids_state = { x: rect.x, y: lineY, width: rect.width, height: itemHeight };
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerSpicer(this._state.activeItem.trigger)) return;
        ADrawText(this._min_arousal_text, "Min Arousal:");

        ADrawTextButton(this._min_arousal_input, (v => v ? `${v}` : '0')(this._state.activeItem.trigger.min_arousal), hasFocus);

        ADrawText(this._max_arousal_text, "Max Arousal:");
        ADrawTextButton(this._max_arousal_input, (v => v ? `${v}` : '100')(this._state.activeItem.trigger.max_arousal), hasFocus);

        ADrawText(this._apply_fav_text, "Apply Favorites:");
        ADrawTextButton(this._apply_fav_switch, (v => v ? 'Yes' : 'No')(this._state.activeItem.trigger.apply_favorite), hasFocus);

        ADrawText(this._allow_ids_text, "On Members:");
        ADrawTextButton(this._allow_ids_state, (v => v ? v.join(", ") : "All IDs")(this._state.activeItem.trigger.allow_ids), hasFocus);
    }
}