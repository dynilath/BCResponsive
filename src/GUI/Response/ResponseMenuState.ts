import { isTriggerActivity, isTriggerOrgasm, isTriggerSpicer } from "../../Data";
import { MaxTriggerNameLength } from "../../Definition";
import { GetText } from "../../i18n";
import { Binding } from "../Widgets/Binding";

class NameProperty extends Binding<string> {
    readonly _state: ResponseMenuState;
    constructor(state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): string {
        if (this._state.targetItem === null) return "";
        return this._state.targetItem.name;
    }
    set value(v: string) {
        if (this._state.targetItem !== null) {
            this._state.targetItem.name = v.substring(0, MaxTriggerNameLength);
        }
    }
}

class ModeProperty extends Binding<string> {
    readonly _state: ResponseMenuState;
    constructor(state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): string {
        if (this._state.targetItem === null) return "";
        return this._state.targetItem.trigger.mode;
    }
    set value(v: string) {
        if (this._state.targetItem !== null) {
            this._state.targetItem.trigger.mode = v as ResponsiveTriggerMode;
        }
    }
}

class TriggerSpicerProperty extends Binding<string> {
    static readonly default_value = {
        "min_arousal": 0,
        "max_arousal": 100,
    }
    readonly _property: keyof ResponsiveTriggerSpicer;
    readonly _state: ResponseMenuState;
    constructor(prop: keyof ResponsiveTriggerSpicer, state: ResponseMenuState) {
        super();
        this._property = prop;
        this._state = state;
    }
    get value(): string {
        if (this._state.targetItem === null) return "";
        let tv = this._state.targetItem.trigger as ResponsiveTriggerSpicer;
        return `${tv[this._property] || TriggerSpicerProperty.default_value[this._property as keyof typeof TriggerSpicerProperty.default_value]}`;
    }
    set value(v: string) {
        if (this._state.targetItem !== null) {
            const tv = this._state.targetItem.trigger as ResponsiveTriggerSpicer;
            if (tv[this._property] === undefined || typeof tv[this._property] === "number") {
                let nv = parseInt(v);
                if (!isNaN(nv)) {
                    if (nv < 0) nv = 0;
                    if (nv > 100) nv = 100;
                    (tv[this._property] as number | undefined) = nv;
                }
            }
        }
    }
}

class SpicerApplyFavoriteProperty extends Binding<boolean> {
    readonly _state: ResponseMenuState;
    constructor(state: ResponseMenuState) {
        super();
        this._state = state;
    }
    get value(): boolean {
        if (this._state.targetItem === null) return false;
        const trigger = this._state.targetItem.trigger as ResponsiveTriggerSpicer;
        return trigger.apply_favorite === undefined ? false : trigger.apply_favorite;
    }
    set value(v: boolean) {
        if (this._state.targetItem !== null) {
            (this._state.targetItem.trigger as ResponsiveTriggerSpicer).apply_favorite = v;
        }
    }

}

export class ResponseMenuState {
    private _target: ResponsivePersonality;
    targetItem: ResponsiveItem | null = null;

    get targetPersona(): ResponsivePersonality {
        return this._target;
    }

    TriggerName(): Binding<string> {
        return new NameProperty(this);
    }

    TriggerMode() {
        return {
            text: ["activity", "orgasm", "spicer"].map(t => { return { display: GetText(t), value: t }; }),
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

    asOrgasm<T>(op: (t: ResponsiveTriggerOrgasm) => T, el?: () => T) {
        if (this.targetItem !== null && isTriggerOrgasm(this.targetItem.trigger))
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    asBaseTrigger<T>(op: (t: ResponsiveTrigger) => T, el?: () => void) {
        if (this.targetItem !== null)
            return op(this.targetItem.trigger);
        else if (el !== undefined)
            el();
    }

    constructor(persona: ResponsivePersonality) {
        this._target = persona;

        if (persona.responses.length > 0)
            this.targetItem = persona.responses[0];

    }
}