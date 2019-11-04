import { StoneChecklist, StoneLocation } from "../declarations";
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
    },
    {
        checklistId: '' + (new Date().getTime() - 500),
        checklistName: 'Aviva Stormbow',
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = { ...stone, isFound: (stone.stoneId % 5 === 0) };
            return stonLoc;
        }),
    },
    {
        checklistId: '' + (new Date().getTime()),
        checklistName: 'Saoirse Shannonsdottir',
        stoneLocations: stoneLocations.map(stone => {
            const stonLoc: StoneLocation = { ...stone, isFound: (stone.stoneId === 7 || stone.stoneId === 21) };
            return stonLoc;
        }),
    },
];