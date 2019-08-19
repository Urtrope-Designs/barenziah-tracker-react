/*
 * Action types
 */
export const TOGGLE_STONE_FOUND_STATUS = 'TOGGLE_STONE_FOUND_STATUS';
export const UPDATE_CHECKLIST_NAME = 'UPDATE_CHECKLIST_NAME';


/*
 * Action creators
 */
export function toggleStoneFoundStatus(stoneId: number) {
    return { type: TOGGLE_STONE_FOUND_STATUS, stoneId };
}
export function updateChecklistName(newName: string) {
    return { type: UPDATE_CHECKLIST_NAME, newName };
}