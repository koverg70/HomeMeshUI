// ------------------------------------
// Constants
// ------------------------------------
export const SETTINGS_CHANGE = 'SETTINGS_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export function settingsChange (settings = {}) {
    return {
        type    : SETTINGS_CHANGE,
        payload : settings
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null

export const settingsReducer = (state = initialState, action) => {
    return action.type === SETTINGS_CHANGE
        ? action.payload
        : state
}
