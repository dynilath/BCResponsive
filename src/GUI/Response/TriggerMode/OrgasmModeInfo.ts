import { DataManager } from "../../../Data";
import { GetText } from "../../../i18n";
import { IGUIScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect } from "../../Widgets/AGUI";
import { Binding } from "../../Widgets/Binding";
import { SegmentButton, SegmentButtonSetting } from "../../Widgets/SegmentButton";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";

const BASE_FONT_SIZE = 36;
const ITEM_HEIGHT = 60;
const ITEM_INNER_SPACING = 10;

class OrgasmTypeBinding extends Binding<OrgasmTriggerType> {
    constructor(readonly state: ResponseMenuState) { super(); }

    get value(): OrgasmTriggerType {
        return this.state.asOrgasm(v => v.type) ?? "Orgasmed";
    }

    set value(v: OrgasmTriggerType) {
        this.state.asOrgasm(t => t.type = v);
        DataManager.save();
    }
}

export class OrgasmModeInfo extends AGUIItem {
    private _components: AGUIItem[] = [];
    constructor(readonly parent: IGUIScreen, readonly state: ResponseMenuState, readonly rect: IRect) {
        super();

        const type_text = { x: rect.x, y: rect.y + BASE_FONT_SIZE / 2 };
        const type_state = { x: rect.x, y: rect.y + BASE_FONT_SIZE + ITEM_INNER_SPACING, width: rect.width, height: ITEM_HEIGHT };

        const segSetting: SegmentButtonSetting<OrgasmTriggerType> = {
            text: [
                { display: GetText("TriggerInfo::Orgasm::Type::Orgasmed"), value: "Orgasmed" },
                { display: GetText("TriggerInfo::Orgasm::Type::Ruined"), value: "Ruined" },
                { display: GetText("TriggerInfo::Orgasm::Type::Resisted"), value: "Resisted" },
                { display: GetText("TriggerInfo::Orgasm::Type::Any"), value: "Any" },
            ],
            binding: new OrgasmTypeBinding(state),
        }

        this._components = [
            new BasicText(type_text, GetText("TriggerInfo::Orgasm::Type")),
            new SegmentButton(segSetting, type_state),
        ]
    }

    Draw(hasFocus: boolean): void {
        this.state.asOrgasm(v => {
            this._components.forEach(v => v.Draw(hasFocus));
        });
    }

    Click(mouse: IPoint): void {
        this.state.asOrgasm(v => {
            this._components.forEach(v => v.Click(mouse));
        });
    }
}