import { isTriggerActivity } from "../../../Data";
import { GetText } from "../../../i18n";
import { GUISettingScreen, setSubscreen } from "../../GUI";
import { AGUIItem, IPoint, IRect } from "../../Widgets/AGUI";
import { DynamicTextRoundButton, TextRoundButton } from "../../Widgets/Button";
import { ADrawCricleTextButton, ADrawText, ADrawTextButton } from "../../Widgets/Common";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";
import { MemberListPopup } from "./MemberListPopup";


export class ActivityModeInfo extends AGUIItem {
    private _state: ResponseMenuState;
    private _rect: IRect;

    private readonly _parent: GUISettingScreen;
    private readonly _activity_text: IPoint;
    private readonly _activity_state: IRect;

    private readonly _bodypart_text: IPoint;
    private readonly _bodypart_state: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    private _components: AGUIItem[] = [];

    constructor(parent: GUISettingScreen, state: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;
        this._state = state;
        this._rect = rect;

        const baseFontSize = 36;
        const itemHeight = 60;
        const spacing = 10;

        let baseY = rect.y;
        const nl = (v: number) => v + spacing + itemHeight + baseFontSize;
        this._activity_text = { x: rect.x, y: baseY + baseFontSize / 2 };
        this._activity_state = { x: rect.x, y: baseY + baseFontSize, width: rect.width, height: itemHeight };

        baseY = nl(baseY);
        this._bodypart_text = { x: rect.x, y: baseY + baseFontSize / 2 };
        this._bodypart_state = { x: rect.x, y: baseY + baseFontSize, width: rect.width, height: itemHeight };

        baseY = nl(baseY);
        this._allow_ids_text = { x: rect.x, y: baseY + baseFontSize / 2 };
        this._allow_ids_state = { x: rect.x, y: baseY + baseFontSize, width: rect.width, height: itemHeight };

        this._components = [
            new BasicText(this._activity_text, GetText("On Activity:")),
            new BasicText(this._bodypart_text, GetText("On Bodyparts:")),
            new BasicText(this._allow_ids_text, GetText("On Members:")),
            new DynamicTextRoundButton(this._activity_state, () =>
                this._state.asActivity(v => (act => {
                    if (act === undefined || act.length === 0)
                        return GetText("All Activities");
                    let result = act.slice(0, 3).map(a => ActivityDictionaryText(`Activity${a}`)).join(", ");
                    if (act.length > 3) result += GetText(" and {0} more", [act.length - 3]);
                    return result;
                })(v.allow_activities)) ?? "", () => { }),
            new DynamicTextRoundButton(this._bodypart_state, () => {
                return this._state.asActivity(v => (v => {
                    if (v === undefined || v.length === 0)
                        return GetText("All Bodyparts");
                    let result = v.slice(0, 3).map(a => AssetGroupMap.get(a)?.Description ?? a).join(", ");
                    if (v.length > 3) result += GetText(" and {0} more", [v.length - 3]);
                    return result;
                })(v.allow_bodyparts)) ?? "";
            }, () => { }),
            new DynamicTextRoundButton(this._allow_ids_state, () => {
                return this._state.asActivity(v => (v => v ? v.join(", ") : GetText("All IDs"))(v.allow_ids)) ?? "";
            }, () => {
                setSubscreen(new MemberListPopup(this._parent, GetText("Trigger Member List"), this._state.asActivity(v => {
                    if (v.allow_ids === undefined) v.allow_ids = [];
                    return v.allow_ids;
                }) ?? []));
            })
        ]
    }

    Draw(hasFocus: boolean): void {
        this._state.asActivity(_ => {
            this._components.forEach(c => c.Draw(hasFocus));
        });
    }

    Click(mouse: IPoint): void {
        this._state.asActivity(_ => {
            this._components.forEach(c => c.Click(mouse));
        });
    }

    Unload(): void {
        this._components.forEach(c => c.Unload());
    }
}
