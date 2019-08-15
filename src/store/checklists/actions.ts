/*
 * Action types
 */
export const TOGGLE_STONE_FOUND_STATUS = 'TOGGLE_STONE_FOUND_STATUS';


/*
 * Action creators
 */
export function toggleStoneFoundStatus(stoneId: number) {
    return { type: TOGGLE_STONE_FOUND_STATUS, stoneId };
}