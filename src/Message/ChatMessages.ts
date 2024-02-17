import { CUSTOM_ACTION_TAG } from "../Definition";

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