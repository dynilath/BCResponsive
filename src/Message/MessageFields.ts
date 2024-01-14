export function ReplaceField(msg: string, player: Character | undefined, target: Character | undefined) {
    // replace {me} with CharacterNickname(player)
    // replace {target} with CharacterNickname(target)
    return msg.replace(/\{(me|target)\}/g, (match, p1) => {
        if (p1 === "me") {
            if (player === undefined) return "???";
            return CharacterNickname(player);
        } else if (p1 === "target") {
            if (target === undefined) return "???";
            return CharacterNickname(target);
        }
        return "???";
    });
}