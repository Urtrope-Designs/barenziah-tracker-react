import { TOGGLE_STONE_FOUND_STATUS } from "./actions";

export function foundStoneIds(state = [], action: any) {
    switch (action.type) {
        case TOGGLE_STONE_FOUND_STATUS:
            const newFoundStoneIds = state.find(i => i === action.stoneId) ? state.filter(i => i !== action.stoneId) : [...state, action.stoneId];
            return {...state, foundStoneIds: newFoundStoneIds};
    }

    return state;
}