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
    FriendNames?: Map<number, string>;
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
    Name: string;
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

declare var MouseX: number;
declare var MouseY: number;
declare var MainCanvas: CanvasRenderingContext2D;
declare function DrawGetImage(Source: string): HTMLImageElement;
declare function DrawImage(Source: string, X: number, Y: number): void;
declare function DrawText(Text: string, X: number, Y: number, Color: string, BackColor?: string): void;
declare function DrawCharacter(C: Character, X: number, Y: number, Zoom: number, IsHeightResizeAllowed: boolean, DrawCanvas: CanvasRenderingContext2D): void;

declare function MouseIn(Left: number, Top: number, Width: number, Height: number): boolean;
declare function MouseXIn(Left: number, Width: number): boolean;
declare function MouseYIn(Top: number, Height: number): boolean;

declare function ElementCreateInput(ID: string, Type: string, Value: string, MaxLength: string): HTMLInputElement;
declare function ElementPosition(ElementID: string, X: number, Y: number, W: number, H?: number): void;
declare function ElementPositionFix(ElementID: string, Font: any, X: number, Y: number, W: number, H: number): void;
declare function ElementRemove(ID: string): void;

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

interface ServerChatRoomMessageBase {
    Content: MessageContentType;
    Sender: number;
}

type ServerChatRoomMessageType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" | "LocalMessage" | "ServerMessage" | "Status";

interface ServerChatRoomMessage extends ServerChatRoomMessageBase {
    Type: ServerChatRoomMessageType;
    Dictionary?: ChatMessageDictionary;
    Timeout?: number;
}

declare function ChatRoomMessage(data: ServerChatRoomMessage): void;

// Activity.js
declare function ActivityDictionaryText(Tag: string): string;
declare var ActivityFemale3DCG: Activity[];

// Preference.js
declare function PreferenceIsPlayerInSensDep(bypassblindness: boolean): boolean;
declare var PreferenceSubscreenList: string[];
declare var PreferenceSubscreen: string;
declare var PreferencePageCurrent: number;
declare var PreferenceMessage: string;

declare function ChatRoomSendChat(): void;
declare function ElementValue(id: string, value?: string): string;

// Asset.js
type RectTuple = [X: number, Y: number, W: number, H: number];
interface AssetGroup {
    readonly Name: AssetGroupName;
    readonly Zone?: readonly RectTuple[];
    readonly Category: 'Appearance' | 'Item' | 'Script';
}
declare var AssetGroup: AssetGroup[];
declare var AssetGroupMap: Map<string, AssetGroup>;

// Common.js
declare function CommonGetFontName(): string;

// Character.js
declare function CharacterNickname(C: Character): string;

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

declare const LZString: import("lz-string").LZStringStatic;