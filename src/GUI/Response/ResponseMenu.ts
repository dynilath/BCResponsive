import { isTriggerActivity } from "../../Data";
import { Colors } from "../../Definition";
import { GUISettingScreen, setSubscreen } from "../GUI";
import { AGUIItem, AGUIScreen, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawText, ADrawTextButton, BasicText, ExitButton, TitleText } from "../Widgets/Common";
import { ActivityModeInfo } from "./ActivityModeInfo";
import { MessageSettinPopup } from "./MessageSettingPopup";
import { ResponseMenuState } from "./ResponseMenuState";
import { SpicerModeInfo } from "./SpicerModeInfo";
import { TriggerModeInfo } from "./TriggerModeInfo";
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
            new TriggerModeInfo(this._state, { x: TriggerInfoNextX, y: MenuBaseY + MenuBaseItemHeight, width: TriggerInfoNextWidth, height: TriggerInfoHeight }),
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
            new ResponseMessageList(this, this._state, {
                x: TriggerMessageBaseX,
                y: MenuBaseY,
                width: TriggerMessageWidth,
                height: 660
            })
        ];
    }
}
export class ResponseMessageList extends AGUIItem {
    private readonly _state: ResponseMenuState;

    private readonly _itemRects: IRect[];

    private readonly _prevButton: IRect;
    private readonly _nextButton: IRect;
    private readonly _pageText: IPoint;

    private readonly _parent: TriggerSetting;

    constructor(parent: TriggerSetting, state: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;
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

    Click(mouse: IPoint): void {
        if (this._state.activeItem === null) return;

        if (WithinRect(mouse, this._prevButton)) {
            this.curPage = Math.max(this.curPage - 1, 0);
        } else if (WithinRect(mouse, this._nextButton)) {
            this.curPage = Math.min(this.curPage + 1, this.maxPage);
        } else {
            this._itemRects.forEach((v, i) => {
                const targetIndex = this.curPage * this._itemRects.length + i;
                if (WithinRect(mouse, v) && this._state.activeItem !== null) {
                    setSubscreen(new MessageSettinPopup(this._parent, this._state.activeItem.messages[targetIndex]));
                }
            });
        }

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

