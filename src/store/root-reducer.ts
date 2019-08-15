import { combineReducers } from "redux";

import { foundStoneIds } from './checklists/reducer';

const rootReducer = combineReducers({
    foundStoneIds,
});