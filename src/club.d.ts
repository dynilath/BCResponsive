declare var TranslationLanguage: string;
declare var CurrentScreen: string;

interface Character {
    Appearance: Item[];
    AllowItem: boolean;
    AssetFamily: string;
    MemberNumber?: number;
    GhostList?: number[];
    BlackList?: number[];
    FriendList?: number[];
    Name: string;
    Nickname: string;
    ActivePose: string[] | null;
    Effect: string[];
    CanInteract: () => boolean;
    CanWalk: () => boolean;
    IsOwnedByMemberNumber: (id: number) => boolean;
    IsLoverOfMemberNumber: (id: number) => boolean;
    OnlineSharedSettings: {
        AllowFullWardrobeAccess: boolean,
        BlockBodyCosplay: boolean,
        AllowPlayerLeashing: boolean,
        DisablePickingLocksOnSelf: boolean,
        GameVersion: string,
        ItemsAffectExpressions: boolean,
    };
    OnlineSettings?: {
        AutoBanBlackList: boolean;
        AutoBanGhostList: boolean;
        DisableAnimations: boolean;
        SearchShowsFullRooms: boolean;
        SearchFriendsFirst: boolean;
        SendStatus?: boolean;
        ShowStatus?: boolean;
        EnableAfkTimer: boolean;
    };
    ArousalSettings: {
        Active: string;
        Visible: string;
        ShowOtherMeter: boolean;
        AffectExpression: boolean;
        AffectStutter: string;
        VFX: string;
        VFXVibrator: string;
        VFXFilter: string;
        Progress: number;
        ProgressTimer: number;
        VibratorLevel: number;
        ChangeTime: number;
        OrgasmTimer?: number;
        OrgasmStage?: number;
        OrgasmCount?: number;
        DisableAdvancedVibes: boolean;
        Activity: { Name: string, Self: number, Other: number }[],
        Zone: { Name: string, Factor: number, Orgasm?: boolean }[],
    }
}

type Color = string | string[];

interface AssetGroup {
    Family: string,
    Name: string,
    Description: string,
    BodyCosplay: boolean
}

interface Asset {
    Name: string;
    Description: string;
    Group: AssetGroup;
}

interface Item {
    Asset: Asset;
    Color: Color;
    Craft?: { Item: string, Property: string, Lock: string, Name: string, Description: string, MemberNumber: number };
    Difficulty?: number;
    Property?: {
        AllowActivity?: string[];
        Attribute?: string[];
        Block?: string[];
        Difficulty?: number;
        Effect?: string[];
        Hide?: string[];
        HideItem?: string[];
        Type?: string;
        Expression?: string | null;
        InsertedBeads?: number;
        OverrideAssetEffect?: boolean;
        LockedBy?: string;
        Mode?: string;
    }
}

interface Activity {
    Name: String;
}

declare var Player: Character | undefined;
declare var ChatRoomCharacter: Character[];

declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

declare function InventoryIsWorn(C: Character, AssetName: string, AssetGroup: string): boolean;
declare function ServerSend(Message: string, Data: any): void;
declare function CommonTime(): number;
declare function ChatRoomSendLocal(Content: string, Timeout?: number): void;
declare function InventoryGet(Character: Character, BodyPart: String): Item | null;
declare function SpeechGetTotalGagLevel(C: Character, NoDeaf?: boolean): number;


declare function CharacterAppearanceSetColorForGroup(Character: Character, Color: Color, BodyPart: String): void;
declare function ServerPlayerAppearanceSync(): void;
declare function CharacterRefresh(C: Character, Push?: boolean, RefreshDialog?: boolean): void;
declare function ChatRoomCharacterItemUpdate(Character: Character, Group: string): void;
declare function ChatRoomCharacterUpdate(Character: Character): void;
declare function AssetGet(Family: string, Group: string, Name: string): Asset | null;
declare function AssetGroupGet(Family: string, Group: string): AssetGroup | null;

declare var KeyPress: number;
declare var MiniGameCheatAvailable: boolean;

declare var MainCanvas: {
    getImageData: (x: number, y: number, w: number, h: number) => { data: [number, number, number] };
}

declare var ServerAccountUpdate: {
    SyncToServer(): void;
    QueueData(Data: object, Force?: true): void
};

declare var MagicPuzzleStarted: boolean;
declare var MiniGameEnded: boolean;
declare var MiniGameVictory: boolean;
declare var MagicPuzzleFinish: number;
declare var ActivityOrgasmRuined: boolean;

type MessageContentType = string;

type CommonChatTags =
    | "SourceCharacter"
    | "DestinationCharacter"
    | "DestinationCharacterName"
    | "TargetCharacter"
    | "TargetCharacterName"
    | "AssetName";

interface ChatMessageDictionaryEntry {
    [k: string]: any;
    Tag?: CommonChatTags | string;
    Text?: string;
    MemberNumber?: number;
}

type ChatMessageDictionary = ChatMessageDictionaryEntry[];

interface IChatRoomMessageBasic {
    Content: MessageContentType;
    Sender: number;
}

type MessageActionType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" | "LocalMessage" | "ServerMessage" | "Status";

interface IChatRoomMessage extends IChatRoomMessageBasic {
    Type: MessageActionType;
    Dictionary?: ChatMessageDictionary;
    Timeout?: number;
}

declare function ChatRoomMessage(data: IChatRoomMessage): void;

declare function PreferenceIsPlayerInSensDep(bypassblindness: boolean): boolean;

declare function ChatRoomSendChat(): void;
declare function ElementValue(id: string, value?: string): string;


// Cafe.js
declare var CafeIsHeadMaid: boolean;

// MaidQuarters.js
declare var MaidQuartersItemClothPrev: any;

declare var ChatRoomTargetMemberNumber: number | null;

//suitcase
declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

//ChatRoom.js
declare function ChatRoomMessageMentionsCharacter(C: Character, msg: string): boolean;
declare function ChatRoomNotificationRaiseChatMessage(C: Character, msg: string): void;
declare function ChatRoomHTMLEntities(msg: string): string;

//Speech.js
declare function SpeechGarble(C: Character, CD: string, NoDeaf?: boolean): string;