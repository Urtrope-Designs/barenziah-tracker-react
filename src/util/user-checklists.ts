import { StoneChecklist, StoneLocation, ChecklistSummary } from "../declarations";
import { STONE_LIST } from './stone-list';

const stoneLocations = STONE_LIST;

export const userChecklists: StoneChecklist[] = [
    {
        checklistId: '' + (new Date().getTime() - 1000),
        checklistName: 'Theo Seannarson',
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = { ...stone, isFound: (stone.stoneId % 3 === 0) };
            return stonLoc;
        }),
        hideCompletedStones: false,
    },
    {
        checklistId: '' + (new Date().getTime() - 500),
        checklistName: 'Aviva Stormbow',
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = { ...stone, isFound: (stone.stoneId % 5 === 0) };
            return stonLoc;
        }),
        hideCompletedStones: true,
    },
    {
        checklistId: '' + (new Date().getTime()),
        checklistName: 'Saoirse Shannonsdottir',
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = { ...stone, isFound: (stone.stoneId === 7 || stone.stoneId === 21) };
            return stonLoc;
        }),
        hideCompletedStones: false,
    },
];

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

export function createNewStoneChecklist(newChecklistName: string): StoneChecklist {
    const newChecklist: StoneChecklist = {
        checklistId: '' + (new Date().getTime()),
        checklistName: newChecklistName,
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = {...stone, isFound: false};
            return stonLoc;
        }),
        hideCompletedStones: false,
    }

    return newChecklist;
}