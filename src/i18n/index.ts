import { ENConfig } from "./EN";
import { CNConfig } from "./CN";

const textmap: Record<string, Record<TextTags, string>> = {
    "EN": ENConfig,
    "CN": CNConfig,
};

export function i18n(srcTag: TextTags, FormatArgs?: any[]) {
    let target = (textmap[globalThis["TranslationLanguage"]] || textmap["EN"])[srcTag];
    if (FormatArgs) {
        target = target.replace(/\{(\d+)\}/g, (m, i) => FormatArgs[i]);
    }
    return target;
}