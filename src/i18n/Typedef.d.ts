type LegacyTextTags = "setting_button_text" | "responsive_setting_title" | "setting_button_popup"
    | "setting_enable" | "setting_title_low" | "setting_title_light" | "setting_title_medium"
    | "setting_title_hot" | "setting_title_orgasm" | "setting_title_pain" | "setting_title_tickle"
    | "setting_input_invalid";

type GeneralTextTags = "General::Confirm" | "General::Cancel" | "General::Add" | "General::Delete"
    | "General::Reset" | "General::Clear" | "General::AllSet";

type CharaInfoTextTags = "CharaInfo::MemberID" | "CharaInfo::Name";

type DefaultTextTags = "Default::NewPersonality" | "Default::NewResponseName" | "Default::ExampleMessage"
    | "Default::Pain" | "Default::Tickle" | "Default::Orgasm" | "Default::ItemName::Pain"
    | "Default::ItemName::Tickle" | "Default::ItemName::Masturbate" | "Default::ItemName::Orgasm"
    | "Default::ItemName::HighArousal" | "Default::ItemName::MidArousal" | "Default::ItemName::LowArousal"
    | "Default::Message::PainAction" | "Default::Message::TickleAction"

type MainMenuTextTags = "MainMenu::PersonalitySetting" | "MainMenu::ResponseSetting" | "MainMenu::MainSwitch"

type PersonaMenuTextTags = "PersonaMenu::EditName" | "PersonaMenu::Import" | "PersonaMenu::Delete"
    | "PersonaMenu::Confirm?" | "PersonaMenu::CreateNew" | "PersonaMenu::DeleteMode"

type PersonaImportTextTags = "PersonaImport::Title" | "PersonaImport::InvalidInput"

type PersonaRenameTextTags = "PersonaRename::Title"

type TriggerModeTextTags = `TriggerMode::${ResponsiveTriggerMode}`

type TriggerInfoTextTags = "TriggerInfo::AddNew" | "TriggerInfo::Name" | "TriggerInfo::OnOff" | "TriggerInfo::Mode"
    | "TriggerInfo::OnActivity" | "TriggerInfo::OnBodyparts" | "TriggerInfo::OnMembers" | "TriggerInfo::AllActivities"
    | "TriggerInfo::NoActivities" | "TriggerInfo::AllBodyparts" | "TriggerInfo::NoBodyparts" | "TriggerInfo::AllMemberIDs"
    | "TriggerInfo::AndMore" | "TriggerInfo::MinArousal" | "TriggerInfo::MaxArousal" | "TriggerInfo::ApplyFavorite"
    | "TriggerInfo::NewResponses" | "TriggerInfo::Orgasm::Type" | `TriggerInfo::Orgasm::Type::${OrgasmTriggerType}`

type MemberListPopupTextTags = "MemberListPopup::Title" | "MemberListPopup::InputID"

type BodypartsPopupTextTags = "BodypartsPopup::Title"

type ActivityPopupTextTags = "ActivityPopup::Title" | "ActivityPopup::Pain" | "ActivityPopup::Tickle"
    | "ActivityPopup::Masturbate" | "ActivityPopup::Feet"

type MessagePopupTextTags = "MessagePopup::EditMessage" | `MessagePopup::Type::${ResponsiveMessageType}`
    | "MessagePopup::InsertMe" | "MessagePopup::InsertOther"

type TextTags = LegacyTextTags | GeneralTextTags | CharaInfoTextTags | DefaultTextTags | MainMenuTextTags
    | PersonaMenuTextTags | PersonaImportTextTags | PersonaRenameTextTags | TriggerModeTextTags
    | TriggerInfoTextTags | MemberListPopupTextTags | BodypartsPopupTextTags | ActivityPopupTextTags
    | MessagePopupTextTags