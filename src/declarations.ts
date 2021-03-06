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
  sublocationName?: string;
  stonePlacementDescription: string;
  holdName: 'Eastmarch'|'Falkreath'|'Haafingar'|'Hjaalmarch'|'The Reach'|'The Rift'|'Whiterun'|'Winterhold';
  stonePlacementImageFilename?: string;
  stonePlacementImageAltText?: string;
  locationImageFilename?: string;
  locationImageAltText?: string;
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

export interface ImageDetails {
  imageTitle?: string;
  imageUrl: string;
  imageAltText: string;
}