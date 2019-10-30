export type ChecklistsMap = Map<string, Checklist>;

export interface Checklist {
    checklistName: string;
    foundStoneIds: FoundStoneIds;
}

export type FoundStoneIds = number[];