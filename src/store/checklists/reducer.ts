import { TOGGLE_STONE_FOUND_STATUS } from "./actions";

export function foundStoneIds(state: any[] = [], action: any) {
    switch (action.type) {
        case TOGGLE_STONE_FOUND_STATUS:
            const newFoundStoneIds = state.find(i => i === action.stoneId) ? state.filter(i => i !== action.stoneId) : [...state, action.stoneId];
            console.log('updated foundStoneIds: ' + newFoundStoneIds);
            return newFoundStoneIds;
        default: 
            return state;
    }
}