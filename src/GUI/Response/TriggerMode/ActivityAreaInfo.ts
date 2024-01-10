import { isTriggerActivity } from "../../../Data";
import { Colors } from "../../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { ADrawFramedRect } from "../../Widgets/Common";
import { ResponseMenuState } from "../ResponseMenuState";

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
            };
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
        if (this._state.targetItem === null || !isTriggerActivity(this._state.targetItem.trigger)) return;

        const allowParts = this._state.targetItem.trigger.allow_bodyparts;

        AssetGroup.forEach((v, i) => {
            if (!v.Zone) return;
            const isHover = v.Zone.some(v => WithinRect({ x: MouseX, y: MouseY }, this.RectTuple2Rect(v)));
            const isActive = allowParts && allowParts.includes(v.Name);
            const color = (() => {
                if (isHover) return Colors.Hover;
                if (isActive) return Colors.Active;
                return "White";
            })();
            v.Zone.forEach((v, i) => {
                ADrawFramedRect(this.RectTuple2Rect(v), color, "Black");
            });
        });
    }
}
