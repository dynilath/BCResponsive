export function ReplaceField(msg: string, player: Character | undefined, target: Character | undefined) {
    return msg.replace(/(PLAYER_NAME|TARGET_NAME)/g, (match) => {
        if (match === "PLAYER_NAME" && player) {
            return CharacterNickname(player);
        } else if (match === "TARGET_NAME" && target) {
            return CharacterNickname(target);
        }
        return match;
    });
}