import { TOGGLE_STONE_FOUND_STATUS, UPDATE_CHECKLIST_NAME } from "./actions";
import { Checklist } from "./types";

const defaultState: Checklist = {
    checklistName: '',
    foundStoneIds: []
}

export function currentChecklist(state: Checklist = defaultState, action: any) {
    switch (action.type) {
        case TOGGLE_STONE_FOUND_STATUS:
            const newFoundStoneIds = state.foundStoneIds.find(i => i === action.stoneId) ? state.foundStoneIds.filter(i => i !== action.stoneId) : [...state.foundStoneIds, action.stoneId];
            console.log('updated foundStoneIds: ' + newFoundStoneIds);
            return {...state, foundStoneIds: newFoundStoneIds};
        case UPDATE_CHECKLIST_NAME:
            return {...state, checklistName: action.newName};
        default: 
            return state;
    }
}