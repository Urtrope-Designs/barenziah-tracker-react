/*
 * Action types
 */
export const TOGGLE_STONE_FOUND_STATUS = 'TOGGLE_STONE_FOUND_STATUS';
export const UPDATE_CHECKLIST_NAME = 'UPDATE_CHECKLIST_NAME';
export const CREATE_NEW_CHECKLIST = 'CREATE_NEW_CHECKLIST';


/*
 * Action creators
 */
export function toggleStoneFoundStatus(checklistId: string, stoneId: number) {
    return { type: TOGGLE_STONE_FOUND_STATUS, checklistId, stoneId };
}
export function updateChecklistName(checklistId: string, newName: string) {
    return { type: UPDATE_CHECKLIST_NAME, checklistId, newName };
}
export function createNewChecklist(checklistName: string) {
    const checklistId = '' + (new Date().getTime());
    return { type: CREATE_NEW_CHECKLIST, checklistId, checklistName};
}