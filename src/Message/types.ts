export interface TriggerDataActivity {
    triggerType: "activity";
    from: number;
    activity: string;
    bodypart: string;
    arousal: number;
}

export interface TriggerDataOrgasm {
    triggerType: "orgasm";
    type: OrgasmTriggerType;
}

export interface TriggerDataRoomEvent {
    triggerType: "event";
    type: RoomEventTriggerType;
}

export type TriggerData = TriggerDataActivity | TriggerDataOrgasm | TriggerDataRoomEvent;

export function isTriggerDataActivity(data: TriggerData): data is TriggerDataActivity {
    return data.triggerType === "activity";
}

export function isTriggerDataOrgasm(data: TriggerData): data is TriggerDataOrgasm {
    return data.triggerType === "orgasm";
}

export function isTriggerDataRoomEvent(data: TriggerData): data is TriggerDataRoomEvent {
    return data.triggerType === "event";
}