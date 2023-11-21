import { ENTextMap } from "./EN";
import { CNTextMap } from "./CN";

const textmap = new Map<string, Map<string,string>>([
    ["CN", CNTextMap],
    ["EN", ENTextMap],
]);

export function LocalizedText(srcTag: string) {
    let target = textmap.get(TranslationLanguage);
    if(target !== undefined) {
        return target.get(srcTag) || srcTag;
    }
    return ENTextMap.get(srcTag) || srcTag;
}