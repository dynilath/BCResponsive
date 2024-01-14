type HandleFunction = (player: Character, sender: Character, data: ServerChatRoomMessage) => void;

export class ChatMessageHandler {
    _handles = new Map<ServerChatRoomMessageType, Array<HandleFunction>>();

    Run(player: Character | undefined, data: ServerChatRoomMessage) {
        if (player === undefined || player.MemberNumber === undefined) return;
        if (player.GhostList && player.GhostList.indexOf(data.Sender) >= 0) return;
        let sender = ChatRoomCharacter.find(c => c.MemberNumber == data.Sender);
        if (sender === undefined) return;
        let f = this._handles.get(data.Type);
        if (f) f.forEach(_ => player && sender && _(player, sender, data));
    };

    Register(type: ServerChatRoomMessageType, handle: HandleFunction) {
        let f = this._handles.get(type);
        if (!f) {
            this._handles.set(type, []);
            f = this._handles.get(type) as Array<HandleFunction>;
        }
        f.push(handle);
    }
}