import { ENTextMap } from "./EN";
import { CNTextMap } from "./CN";

const textmap = new Map<string, Map<string, string>>([
    ["CN", CNTextMap],
    ["EN", ENTextMap],
]);

export function GetText(srcTag: string, FormatArgs?: any[]) {
    let target = textmap.get(TranslationLanguage);
    let ret = target?.get(srcTag) || srcTag;
    if (FormatArgs) {
        ret = ret.replace(/\{(\d+)\}/g, (m, i) => FormatArgs[i]);
    }
    return ret;
}