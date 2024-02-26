
export function isTriggerActivity(trigger: ResponseTrigger): trigger is ResponsiveTriggerActivity {
    return trigger.mode === "activity";
}
export function isTriggerOrgasm(trigger: ResponseTrigger): trigger is ResponsiveTriggerOrgasm {
    return trigger.mode === "orgasm";
}
export function isTriggerSpicer(trigger: ResponseTrigger): trigger is ResponsiveTriggerSpicer {
    return trigger.mode === "spicer";
}
export function isNumberArray(data: any): data is number[] {
    return Array.isArray(data) && data.every(_ => typeof _ === 'number');
}
export function isStringArray(data: any): data is string[] {
    return Array.isArray(data) && data.every(_ => typeof _ === 'string');
}
export function FirstOr<T, U>(v1: T, v2: U) {
    return (id: number) => {
        if (id === 0) return v1;
        else return v2;
    };
}

