import { StoneChecklist, StoneLocation, ChecklistSummary } from "../declarations";
import { STONE_LIST } from './stone-list';

const stoneLocations = STONE_LIST;

export function getChecklistSummaries(checklists: StoneChecklist[]): ChecklistSummary[] {
    const summaries = checklists.map(checklist => {
       const checklistSummary: ChecklistSummary = {
           checklistId: checklist.checklistId,
           checklistName: checklist.checklistName,
           numStonesToFind: STONE_LIST.length - checklist.stoneLocations.reduce<number>((total, curStonLoc) => curStonLoc.isFound ? ++total : total, 0),
       };
       return checklistSummary
   });
   return summaries;
};

export function createNewStoneChecklist(newChecklistName: string, checklistId: string = ''): StoneChecklist {
    const newChecklist: StoneChecklist = {
        checklistId: checklistId,
        checklistName: newChecklistName,
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = {...stone, isFound: false};
            return stonLoc;
        }),
        hideCompletedStones: false,
    }

    return newChecklist;
}