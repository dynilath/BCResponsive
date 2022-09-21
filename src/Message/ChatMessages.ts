interface ActivityInfo {
    SourceCharacter: { Name: string, MemberNumber: number };
    TargetCharacter: { Name: string, MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
}

export function ActivityDeconstruct(dict: ChatMessageDictionary): ActivityInfo | undefined {
    let SourceCharacter, TargetCharacter, ActivityGroup, ActivityName;
    for (let v of dict) {
        if (!v.Tag) continue;
        if (v.Tag === 'TargetCharacter' && v.Text && v.MemberNumber)
            TargetCharacter = { Name: v.Text, MemberNumber: v.MemberNumber };
        else if (v.Tag === 'SourceCharacter' && v.Text && v.MemberNumber)
            SourceCharacter = { Name: v.Text, MemberNumber: v.MemberNumber };
        else if (v.Tag === 'ActivityGroup' && v.Text)
            ActivityGroup = v.Text;
        else if (v.Tag === 'ActivityName' && v.Text)
            ActivityName = v.Text;
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

export function ChatRoomAutoInterceptMessage(cur_msg: string, msg: string) {
    if (IsSimpleChat(cur_msg) && ChatRoomTargetMemberNumber == null) {
        ChatRoomInterceptMessage(cur_msg, msg);
    } else {
        ChatRoomNormalMessage(msg);
    }
}