import { combineReducers } from "redux";

import { foundStoneIds } from './checklists/reducer';

export const rootReducer = combineReducers({
    foundStoneIds,
});