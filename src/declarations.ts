export interface ChecklistSummary {
  checklistId: string;
  checklistName: string;
  numStonesToFind: number;
}

export interface StoredChecklist {
  checklistName: string;
  foundStoneIds: FoundStoneIds;
}

export type FoundStoneIds = number[];

export interface StoneLocationData {
  stoneId: number;
  locationName: string;
  holdName: 'Eastmarch'|'Falkreath'|'Haafingar'|'Hjaalmarch'|'The Reach'|'The Rift'|'Whiterun'|'Winterhold';
}

export interface StoneLocation extends StoneLocationData{
  isFound: boolean;
}

export interface StoneChecklist {
  checklistId: string;
  checklistName: string;
  stoneLocations: StoneLocation[];
  hideCompletedStones: boolean;
}