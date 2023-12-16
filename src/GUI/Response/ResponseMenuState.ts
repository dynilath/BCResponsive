export class ResponseMenuState {
    private _target: ResponsivePersonality;
    private _targetItem: ResponsiveItem | null = null;

    get activeItem(): ResponsiveItem | null {
        return this._targetItem;
    }

    set activeItem(value: ResponsiveItem | null) {
        this._targetItem = value;
    }

    get targetPersona(): ResponsivePersonality {
        return this._target;
    }

    constructor(persona: ResponsivePersonality) {
        this._target = persona;

        if (persona.responses.length > 0)
            this._targetItem = persona.responses[0];
    }
}