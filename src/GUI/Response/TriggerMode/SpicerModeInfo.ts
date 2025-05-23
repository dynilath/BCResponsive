import { Styles } from "../../../Definition";
import { i18n } from "../../../i18n";
import { GUISetting, IGUIScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect } from "../../Widgets/AGUI";
import { DynamicTextRoundButton } from "../../Widgets/Button";
import { ButtonEdit } from "../../Widgets/ButtonEdit";
import { Switch } from "../../Widgets/Switch";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";
import { MemberListPopup } from "./MemberListPopup";

export class SpicerModeInfo extends AGUIItem {
    private readonly _min_arousal_text: IPoint;
    private readonly _min_arousal_input: IRect;

    private readonly _max_arousal_text: IPoint;
    private readonly _max_arousal_input: IRect;

    private readonly _apply_fav_text: IPoint;
    private readonly _apply_fav_switch: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    private _editList: AGUIItem[] = [];
    private _components: AGUIItem[] = [];

    constructor(readonly parent: IGUIScreen, readonly state: ResponseMenuState, readonly rect: IRect) {
        super();

        const itemHeight = 60;
        const spacing = 10;
        const arousalTextWidth = 250;

        let lineY = rect.y;
        const nl = (v: number) => v + spacing + Styles.Input.height;

        this._min_arousal_text = { x: rect.x, y: lineY + Styles.Input.height / 2 };
        this._min_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: Styles.Input.height };

        lineY = nl(lineY);
        this._max_arousal_text = { x: rect.x, y: lineY + Styles.Input.height / 2 };
        this._max_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: Styles.Input.height };

        lineY = nl(lineY);
        this._apply_fav_text = { x: rect.x, y: lineY + Styles.Input.height / 2 };
        this._apply_fav_switch = { x: rect.x + +rect.width - itemHeight * 2, y: lineY, width: itemHeight * 2, height: Styles.Input.height };

        lineY = nl(lineY);
        this._allow_ids_text = { x: rect.x, y: lineY + Styles.Input.height / 2 };
        lineY = nl(lineY);
        this._allow_ids_state = { x: rect.x, y: lineY, width: rect.width, height: Styles.Input.height };

        this._editList = [
            new ButtonEdit(this.state.SpicerMinArousal(), "MinArousal", this._min_arousal_input),
            new ButtonEdit(this.state.SpicerMaxArousal(), "MaxArousal", this._max_arousal_input),
        ];

        this._components = [
            new BasicText(this._min_arousal_text, i18n("TriggerInfo::MinArousal")),
            new BasicText(this._max_arousal_text, i18n("TriggerInfo::MaxArousal")),
            ...this._editList,
            new BasicText(this._apply_fav_text, i18n("TriggerInfo::ApplyFavorite")),
            new Switch(this.state.SpicerApplyFavorite(), this._apply_fav_switch),
            new BasicText(this._allow_ids_text, i18n("TriggerInfo::OnMembers")),
            new DynamicTextRoundButton(this._allow_ids_state, () => this.state.asSpicer(v => (ids => {
                if (ids === undefined || ids.length === 0)
                    return i18n("TriggerInfo::AllMemberIDs");
                let result = ids.slice(0, 3).join(", ");
                if (ids.length > 3) result += i18n("TriggerInfo::AndMore", [ids.length - 3]);
                return result;
            })(v.allow_ids)) ?? "", () => GUISetting.setScreen(new MemberListPopup(this.parent, i18n("MemberListPopup::AllowIDs::Title"), this.state.asSpicer(v => {
                if (v.allow_ids === undefined) v.allow_ids = [];
                return v.allow_ids;
            }) ?? [])))
        ];

    }

    Draw(hasFocus: boolean): void {
        this.state.asSpicer(v => {
            this._components.forEach(v => v.Draw(hasFocus));
        }, () => {
            this._editList.forEach(v => v.Draw(false));
        });
    }

    Click(mouse: IPoint): void {
        this.state.asSpicer(v => {
            this._components.forEach(v => v.Click(mouse));
        });
    }

    Unload(): void {
        this._editList.forEach(v => v.Unload());
    }
}
