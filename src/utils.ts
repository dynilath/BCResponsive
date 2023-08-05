export function ShuffleStr(src: string[]) {
    let temp: string[] = JSON.parse(JSON.stringify(src));
    let ret: string[] = []
    while (temp.length > 0) {
        let d = Math.floor(Math.random() * temp.length);
        ret.push(temp[d]);
        temp.splice(d, 1);
    }
    return ret;
}

export function ChatRoomSendAction(Content: string) {
    if (!Content || !Player || !Player.MemberNumber) return;
    ServerSend("ChatRoomChat", {
        Content: "Beep",
        Type: "Action",
        Dictionary: [
            { Tag: "Beep", Text: "msg" },
            { Tag: "Biep", Text: "msg" },
            { Tag: "Sonner", Text: "msg" },
            { Tag: "发送私聊", Text: "msg" },
            { Tag: "msg", Text: Content }
        ]
    });
}