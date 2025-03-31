import { DataManager, isTriggerActivity, isTriggerOrgasm, isTriggerSpicer } from "../../Data";
import { isTriggerRoomEvent } from "../../Data/types";
import { MaxNameLength } from "../../Definition";
import { isTriggerDataRoomEvent } from "../../Message/types";
import { i18n } from "../../i18n";
import { Binding } from "../Widgets/Binding";
import { SegmentButtonSetting } from "../Widgets/SegmentButton";

class NameProperty extends Binding<string> {
    readonly _state: ResponseMenuState;
    constructor(readonly state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): string {
        if (this._state.targetItem === null) return "";
        return this._state.targetItem.name;
    }
    set value(v: string) {
        if (this._state.targetItem !== null) {
            this._state.targetItem.name = v.substring(0, MaxNameLength);
            DataManager.save();
        }
    }
}

class EnabledProperty extends Binding<boolean> {
    readonly _state: ResponseMenuState;
    constructor(readonly state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): boolean {
        if (this._state.targetItem === null) return false;
        return this._state.targetItem.enabled;
    }
    set value(v: boolean) {
        if (this._state.targetItem !== null) {
            this._state.targetItem.enabled = v;
            DataManager.save();
        }
    }
}

class ModeProperty extends Binding<ResponseTriggerMode> {
    readonly _state: ResponseMenuState;
    constructor(readonly state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): ResponseTriggerMode {
        if (this._state.targetItem === null) return "activity";
        return this._state.targetItem.trigger.mode;
    }
    set value(v: ResponseTriggerMode) {
        if (this._state.targetItem !== null) {
            this._state.targetItem.trigger.mode = v;
            DataManager.save();
        }
    }
}

class TriggerSpicerProperty extends Binding<string> {
    static readonly default_value = {
        "min_arousal": 0,
        "max_arousal": 100,
    }
    constructor(readonly property: keyof ResponsiveTriggerSpicer, readonly state: ResponseMenuState) {
        super();
    }
    get value(): string {
        if (this.state.targetItem === null) return "";
        let tv = this.state.targetItem.trigger as ResponsiveTriggerSpicer;
        return `${tv[this.property] || TriggerSpicerProperty.default_value[this.property as keyof typeof TriggerSpicerProperty.default_value]}`;
    }
    set value(v: string) {
        if (this.state.targetItem !== null) {
            const tv = this.state.targetItem.trigger as ResponsiveTriggerSpicer;
            if (tv[this.property] === undefined || typeof tv[this.property] === "number") {
                let nv = parseInt(v);
                if (!isNaN(nv)) {
                    if (nv < 0) nv = 0;
                    if (nv > 100) nv = 100;
                    (tv[this.property] as number | undefined) = nv;
                    DataManager.save();
                }
            }
        }
    }
}

class SpicerApplyFavoriteProperty extends Binding<boolean> {
    constructor(readonly state: ResponseMenuState) {
        super();
    }
    get value(): boolean {
        if (this.state.targetItem === null) return false;
        const trigger = this.state.targetItem.trigger as ResponsiveTriggerSpicer;
        return trigger.apply_favorite === undefined ? false : trigger.apply_favorite;
    }
    set value(v: boolean) {
        if (this.state.targetItem !== null) {
            (this.state.targetItem.trigger as ResponsiveTriggerSpicer).apply_favorite = v;
            DataManager.save();
        }
    }

}

export interface ExpandList<T> {
    value: T[] | undefined; // undefined means all
}

export class ResponseMenuState {
    targetItem: ResponseItem | null = null;

    get targetPersona(): ResponsivePersonality {
        return this.persona;
    }

    TriggerName(): Binding<string> {
        return new NameProperty(this);
    }

    TriggerEnabled(): Binding<boolean> {
        return new EnabledProperty(this);
    }

    TriggerMode(): SegmentButtonSetting<ResponseTriggerMode> {
        return {
            text: [
                { display: i18n(`TriggerMode::activity`), value: "activity" },
                { display: i18n(`TriggerMode::orgasm`), value: "orgasm" },
                { display: i18n(`TriggerMode::spicer`), value: "spicer" },
                { display: i18n(`TriggerMode::event`), value: "event" }
            ],
            binding: new ModeProperty(this)
        }
    }

    SpicerMinArousal(): Binding<string> {
        return new TriggerSpicerProperty("min_arousal", this);
    }

    SpicerMaxArousal(): Binding<string> {
        return new TriggerSpicerProperty("max_arousal", this);
    }

    SpicerApplyFavorite(): Binding<boolean> {
        return new SpicerApplyFavoriteProperty(this);
    }

    asSpicer<T>(op: (t: ResponsiveTriggerSpicer) => T, el?: () => void) {
        if (this.targetItem !== null && isTriggerSpicer(this.targetItem.trigger))
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asActivity<T>(op: (t: ResponsiveTriggerActivity) => T, el?: () => void) {
        if (this.targetItem !== null && isTriggerActivity(this.targetItem.trigger))
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asHasAllowIds<T>(op: (t: ResponsiveTriggerActivity | ResponsiveTriggerSpicer) => T, el?: () => void) {
        if (this.targetItem !== null && (isTriggerActivity(this.targetItem.trigger) || isTriggerSpicer(this.targetItem.trigger)))
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asOrgasm<T>(op: (t: ResponsiveTriggerOrgasm) => T, el?: () => T) {
        if (this.targetItem !== null && isTriggerOrgasm(this.targetItem.trigger))
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asBaseTrigger<T>(op: (t: ResponseTrigger) => T, el?: () => void) {
        if (this.targetItem !== null)
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asRoomEvent<T>(op: (t: ResponsiveTriggerRoomEvent) => T, el?: () => void) {
        if (this.targetItem !== null && isTriggerRoomEvent(this.targetItem.trigger))
            return op(this.targetItem.trigger as ResponsiveTriggerRoomEvent);
        else if (el !== undefined)
            el();
    }

    constructor(readonly persona: ResponsivePersonality) {
        if (persona.responses.length > 0)
            this.targetItem = persona.responses[0];

    }
}