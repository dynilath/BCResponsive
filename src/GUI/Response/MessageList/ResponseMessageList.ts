import { setSubscreen } from "../../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { ADrawText, ADrawTextButton } from "../../Widgets/Common";
import { MessageSettinPopup } from "./MessageSettingPopup";
import { ResponseMenuState } from "../ResponseMenuState";
import { TriggerSetting } from "../ResponseMenu";

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
            };
        });

        this._prevButton = { x: rect.x, y: rect.y, width: itemHeight, height: itemHeight };
        this._nextButton = { x: rect.x + rect.width - itemHeight, y: rect.y, width: itemHeight, height: itemHeight };
        this._pageText = { x: rect.x + rect.width / 2, y: rect.y + 30 };
    }

    private curPage: number = 0;
    private maxPage: number = 0;

    Draw(hasFocus: boolean): void {
        if (this._state.targetItem === null) return;

        const messages = this._state.targetItem.messages;
        const itemPerPage = this._itemRects.length;

        this.maxPage = Math.max(0, Math.ceil(messages.length / itemPerPage) - 1);
        this.curPage = Math.max(0, Math.min(this.curPage, this.maxPage));

        this._itemRects.forEach((v, i) => {
            const targetIndex = this.curPage * itemPerPage + i;
            if (messages.length > targetIndex && targetIndex >= 0) {
                const message = messages[targetIndex];
                ADrawTextButton({ x: v.x, y: v.y, width: 100, height: v.height }, message.type, hasFocus);
                ADrawTextButton({ x: v.x + 120, y: v.y, width: v.width - 120, height: v.height }, message.content, hasFocus);
            } else if (messages.length === targetIndex) {
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
        if (this._state.targetItem === null) return;

        if (WithinRect(mouse, this._prevButton)) {
            this.curPage = Math.max(this.curPage - 1, 0);
        } else if (WithinRect(mouse, this._nextButton)) {
            this.curPage = Math.min(this.curPage + 1, this.maxPage);
        } else {
            this._itemRects.forEach((v, i) => {
                const targetIndex = this.curPage * this._itemRects.length + i;
                if (WithinRect(mouse, v) && this._state.targetItem !== null) {
                    setSubscreen(new MessageSettinPopup(this._parent, this._state.targetItem.messages[targetIndex]));
                }
            });
        }

    }
}
