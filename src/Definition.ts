function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export enum MoanType {
    Orgasm,
    Pain,
    Tickle
}

export const ModVersion = buildVersion(1, 0, 0);
export const ModName = 'BondageClub Responsive'

export const DebugMode = true;

export const SettingName = "BCResponsiveSetting";

export const CUSTOM_ACTION_TAG = "BCR_CustomAction";

export const Colors = {
    Active: "#CCC",
    Hover: "#80FFFF"
}

export const DefaultPersonaName = "Default";
export const DefaultPersonaIndex = 0;
export const MaxPersonalities = 5;

export const MaxTriggerNameLength = 20;