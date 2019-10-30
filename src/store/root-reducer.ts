import { combineReducers } from "redux";

import { checklistsMap } from './checklists/reducer';

export const rootReducer = combineReducers({
    checklistsMap: checklistsMap,
});