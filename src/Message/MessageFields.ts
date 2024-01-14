export function ReplaceField(msg: string, player: Character | undefined, other: Character | undefined) {
    // replace {me} with CharacterNickname(player)
    // replace {target} with CharacterNickname(target)
    return msg.replace(/\{(me|other)\}/g, (match, p1) => {
        if (p1 === "me") {
            if (player === undefined) return "???";
            return CharacterNickname(player);
        } else if (p1 === "other") {
            if (other === undefined) return "???";
            return CharacterNickname(other);
        }
        return "???";
    });
}