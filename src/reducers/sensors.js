import fetch from 'isomorphic-fetch';

export const SENSORS_SET = 'SENSORS_SET'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [SENSORS_SET] : (state, action) => Object.assign({}, action.payload)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export const sensorsReducer  = (state = initialState, action) =>{
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

export const loadValues = (node) => {
    return (dispatch, getState) => {
        fetch('/master/V0:*')
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                response.json().then(function(data) {
                    //console.log(data);
                    dispatch({type: SENSORS_SET, payload: data});
                });
            });
    }
}
