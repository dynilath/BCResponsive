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