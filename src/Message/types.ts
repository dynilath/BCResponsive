export interface TriggerDataActivity {
    type: "activity";
    from: number;
    activity: string;
    bodypart: string;
    arousal: number;
}

export interface TriggerDataOrgasm {
    type: "orgasm";
}

export type TriggerData = TriggerDataActivity | TriggerDataOrgasm;

export function isTriggerDataActivity(data: TriggerData): data is TriggerDataActivity {
    return data.type === "activity";
}

export function isTriggerDataOrgasm(data: TriggerData): data is TriggerDataOrgasm {
    return data.type === "orgasm";
}