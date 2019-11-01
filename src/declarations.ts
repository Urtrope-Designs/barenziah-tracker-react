export interface AppPage {
  url: string;
  icon: object;
  title: string;
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
  checklistName: string;
  stoneLocations: StoneLocation[];
}