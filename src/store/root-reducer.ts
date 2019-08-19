import { combineReducers } from "redux";

import { currentChecklist } from './checklists/reducer';

export const rootReducer = combineReducers({
    currentChecklist,
});