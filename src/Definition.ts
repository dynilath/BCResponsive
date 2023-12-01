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

export const DefaultPersonaName = "Default";
export const MaxPersonalities = 5;