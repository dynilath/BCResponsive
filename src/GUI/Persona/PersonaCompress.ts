import { V2ValidatePersonality } from "../../Data";

export function PersonaToLZString(persona: ResponsivePersonality) {
    return LZString.compressToBase64(JSON.stringify(Object.assign({}, { name: persona.name, responses: persona.responses })));
}

export function LZStringToPersona(src: string): ResponsivePersonality | undefined {
    let d = LZString.decompressFromBase64(src);
    let data: any | undefined;
    if (!d) return undefined;
    try {
        data = JSON.parse(d);
    } catch (e) {
        return undefined;
    }
    Object.assign(data, { index: -1 });
    return V2ValidatePersonality(data);
}