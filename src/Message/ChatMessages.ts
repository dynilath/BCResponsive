interface ActivityInfo {
    SourceCharacter: { MemberNumber: number };
    TargetCharacter: { MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
}

export function ActivityDeconstruct(dict: ChatMessageDictionary): ActivityInfo | undefined {
    let SourceCharacter, TargetCharacter, ActivityGroup, ActivityName;
    for (let v of dict) {
        if (v.hasOwnProperty('TargetCharacter')) {
            TargetCharacter = { MemberNumber: v['TargetCharacter'] };
        } else if (v.hasOwnProperty('SourceCharacter')) {
            SourceCharacter = { MemberNumber: v['SourceCharacter'] };
        } else if (v.hasOwnProperty('ActivityName')) {
            ActivityName = v['ActivityName'];
        } else if (v.hasOwnProperty('Tag') && v.Tag === 'FocusAssetGroup') {
            ActivityGroup = v['FocusGroupName'];
        }
    }
    if (SourceCharacter === undefined || TargetCharacter === undefined
        || ActivityGroup === undefined || ActivityName === undefined) return undefined;
    return { SourceCharacter, TargetCharacter, ActivityGroup, ActivityName };
}

function IsSimpleChat(msg: string) {
    return msg.trim().length > 0 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*");
}

function ChatRoomInterceptMessage(cur_msg: string, msg: string) {
    if (!msg) return;
    ElementValue("InputChat", cur_msg + "... " + msg);
    ChatRoomSendChat();
}

function ChatRoomNormalMessage(msg: string) {
    if (!msg) return;
    let backupChatRoomTargetMemberNumber = ChatRoomTargetMemberNumber;
    ChatRoomTargetMemberNumber = null;
    let oldmsg = ElementValue("InputChat");
    ElementValue("InputChat", msg);
    ChatRoomSendChat();
    ElementValue("InputChat", oldmsg);
    ChatRoomTargetMemberNumber = backupChatRoomTargetMemberNumber;
}

export function ChatRoomAutoInterceptMessage(msg: string) {
    let cur_msg = ElementValue("InputChat");
    if (IsSimpleChat(cur_msg) && ChatRoomTargetMemberNumber == null) {
        ChatRoomInterceptMessage(cur_msg, msg);
    } else {
        ChatRoomNormalMessage(msg);
    }
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