function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export enum MoanType {
    Orgasm,
    Pain,
    Tickle
}

export const ModVersion = buildVersion(0, 3, 1);
export const ModName = 'BondageClub Moaner Reloaded'

export const DebugMode = false;