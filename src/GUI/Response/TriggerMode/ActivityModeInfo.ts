import { GetText } from "../../../i18n";
import { GUISetting, IGUIScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect } from "../../Widgets/AGUI";
import { DynamicTextRoundButton } from "../../Widgets/Button";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";
import { ActivityPopup } from "./ActivityPopup";
import { BodypartsPopup } from "./BodypartsPopup";
import { MemberListPopup } from "./MemberListPopup";

const BASE_FONT_SIZE = 36;
const ITEM_HEIGHT = 60;
const ITEM_INNER_SPACING = 10;
const ITEM_SPACING = 20;


export class ActivityModeInfo extends AGUIItem {
    private readonly _activity_text: IPoint;
    private readonly _activity_state: IRect;

    private readonly _bodypart_text: IPoint;
    private readonly _bodypart_state: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    private _components: AGUIItem[] = [];

    constructor(readonly parent: IGUIScreen, readonly state: ResponseMenuState, readonly rect: IRect) {
        super();

        const T_ITEM_HEIGHT = BASE_FONT_SIZE + ITEM_INNER_SPACING + ITEM_HEIGHT;

        let baseY = rect.y;
        const nl = (v: number) => v + T_ITEM_HEIGHT + ITEM_SPACING;
        this._activity_text = { x: rect.x, y: baseY + BASE_FONT_SIZE / 2 };
        this._activity_state = { x: rect.x, y: baseY + BASE_FONT_SIZE + ITEM_INNER_SPACING, width: rect.width, height: ITEM_HEIGHT };

        baseY = nl(baseY);
        this._bodypart_text = { x: rect.x, y: baseY + BASE_FONT_SIZE / 2 };
        this._bodypart_state = { x: rect.x, y: baseY + BASE_FONT_SIZE + ITEM_INNER_SPACING, width: rect.width, height: ITEM_HEIGHT };

        baseY = nl(baseY);
        this._allow_ids_text = { x: rect.x, y: baseY + BASE_FONT_SIZE / 2 };
        this._allow_ids_state = { x: rect.x, y: baseY + BASE_FONT_SIZE + ITEM_INNER_SPACING, width: rect.width, height: ITEM_HEIGHT };

        this._components = [
            new BasicText(this._activity_text, GetText("TriggerInfo::OnActivity")),
            new BasicText(this._bodypart_text, GetText("TriggerInfo::OnBodyparts")),
            new BasicText(this._allow_ids_text, GetText("TriggerInfo::OnMembers")),
            new DynamicTextRoundButton(this._activity_state, () =>
                this.state.asActivity(v => (act => {
                    if (act === undefined)
                        return GetText("TriggerInfo::AllActivities");
                    if (act.length === 0)
                        return GetText("TriggerInfo::NoActivities");
                    let result = act.slice(0, 3).map(a => ActivityDictionaryText(`Activity${a}`)).join(", ");
                    if (act.length > 3) result += GetText("TriggerInfo::AndMore", [act.length - 3]);
                    return result;
                })(v.allow_activities)) ?? "", () => GUISetting.setScreen(new ActivityPopup(this.parent, this.state))),
            new DynamicTextRoundButton(this._bodypart_state, () => {
                return this.state.asActivity(v => (bparts => {
                    if (bparts === undefined)
                        return GetText("TriggerInfo::AllBodyparts");
                    if (bparts.length === 0)
                        return GetText("TriggerInfo::NoBodyparts");
                    let result = bparts.slice(0, 3).map(a => AssetGroupMap.get(a)?.Description ?? a).join(", ");
                    if (bparts.length > 3) result += GetText("TriggerInfo::AndMore", [bparts.length - 3]);
                    return result;
                })(v.allow_bodyparts)) ?? "";
            }, () => GUISetting.setScreen(new BodypartsPopup(this.parent, this.state))),
            new DynamicTextRoundButton(this._allow_ids_state, () => {
                return this.state.asActivity(v => (ids => {
                    if (ids === undefined || ids.length === 0)
                        return GetText("TriggerInfo::AllMemberIDs");
                    let result = ids.slice(0, 3).join(", ");
                    if (ids.length > 3) result += GetText("TriggerInfo::AndMore", [ids.length - 3]);
                    return result;
                })(v.allow_ids)) ?? "";
            }, () => GUISetting.setScreen(new MemberListPopup(this.parent, GetText("MemberListPopup::AllowIDs::Title"), this.state.asActivity(v => {
                if (v.allow_ids === undefined) v.allow_ids = [];
                return v.allow_ids;
            }) ?? [])))
        ]
    }

    Draw(hasFocus: boolean): void {
        this.state.asActivity(_ => {
            this._components.forEach(c => c.Draw(hasFocus));
        });
    }

    Click(mouse: IPoint): void {
        this.state.asActivity(_ => {
            this._components.forEach(c => c.Click(mouse));
        });
    }

    Unload(): void {
        this._components.forEach(c => c.Unload());
    }
}
