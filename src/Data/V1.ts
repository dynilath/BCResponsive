import { isStringArray } from "./types";

export const DefaultValueV1: ResponsiveSettingV1 = {
    settings: { enable: true },
    hot: ["n... Nyah♥", "Oooh", "mmmmmh!", "NYyaaA♥"],
    medium: ["mm", "aaaah", "nyAh♥"],
    light: ["nyah♥", "Aah!", "mh", "oh!♥", "mh♥"],
    low: ["", "", "mh", "♥oh♥", "ah", "...♥"],
    orgasm: ["Nya...Ny...NyaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... Nyah!"],
    pain: ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
    tickle: ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
};

export const DefaultValueV1TriggerActivities = {
    pain: ["Slap", "Bite", "Spank", "Kick", "Pinch", "SpankItem", "ShockItem"],
    tickle: ["Tickle", "TickleItem"],
    masturbate: ["MasturbateHand", "MasturbateFist", "MasturbateFoot", "MasturbateTongue", "MasturbateItem", "PenetrateFast", "PenetrateSlow", "PenetrateItem"],
};

export function isV1Setting(data: any): data is ResponsiveSettingV1 {
    if (data === undefined) return false;
    if (typeof data.settings !== "object") return false;
    if (typeof data.settings.enable !== "boolean") return false;
    if (!isStringArray(data.hot)) return false;
    if (!isStringArray(data.medium)) return false;
    if (!isStringArray(data.light)) return false;
    if (!isStringArray(data.low)) return false;
    if (!isStringArray(data.orgasm)) return false;
    if (!isStringArray(data.pain)) return false;
    if (!isStringArray(data.tickle)) return false;
    return true;
}

