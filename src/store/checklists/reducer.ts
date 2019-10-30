import { TOGGLE_STONE_FOUND_STATUS, UPDATE_CHECKLIST_NAME, CREATE_NEW_CHECKLIST } from "./actions";
import { ChecklistsMap } from "./types";

const defaultState: ChecklistsMap = new Map([['Stone Locations', {
    checklistName: 'Stone Locations',
    foundStoneIds: []
}]]);

export function checklistsMap(state: ChecklistsMap = defaultState, action: any) {
    switch (action.type) {
        case TOGGLE_STONE_FOUND_STATUS:
            let curChecklist = state.get(action.checklistId);
            if (curChecklist != null) {
                const newFoundStoneIds = curChecklist.foundStoneIds.some(i => i === action.stoneId) ? curChecklist.foundStoneIds.filter(i => i !== action.stoneId) : [...curChecklist.foundStoneIds, action.stoneId];
                console.log('updated foundStoneIds: ' + newFoundStoneIds);
                state.set(action.checklistId, {...curChecklist, foundStoneIds: newFoundStoneIds});
                return state;
            } else {
                console.error('Invalid checklistId: ', action.checklistId);
            }
            break;
        case UPDATE_CHECKLIST_NAME:
            curChecklist = state.get(action.checklistId);
            if (curChecklist != null) {
                state.set(action.checklistId, {...curChecklist, checklistName: action.newName});
                return state;
            } else {
                console.error('Invalid checklistId: ', action.checklistId);
            }
            break;
        case CREATE_NEW_CHECKLIST: 
            if (state.has(action.checklistId)) {
                console.error('duplicate checklistId in CREATE_NEW_CHECKLIST: ', action.checklistId);
                return state;
            }
            state.set(action.checklistId, {checklistName: action.checklistName, foundStoneIds: []});
            return state;
        default:
            return state;
    }
}