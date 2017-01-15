// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Action creators
// ------------------------------------

export const checkItem = (index, node) => (dispatch, ownProps) => dispatch({type: 'TOGGLE_SCHEDULE', index, node})

export const initValues = () => (dispatch) => dispatch({type: 'DISPLAY_SCHEDULE'})

export const createSchedule = (schedule = undefined) => {
    let retVal = Array(96).fill().map((e,i)=>0); // array with 96 0-s in it
    if (schedule) {
        for (let i = 0; i < 24; ++i) {
            let value = parseInt(schedule.charAt(i), 16);
            for (let j = 3; j >= 0; --j) {
                let b = value % 2;
                value = (value-b) / 2;
                if (b) {
                    retVal[i*4+j] = 1;
                }
                else {
                    retVal[i*4+j] = 0;
                }
            }
        }
    }
    return retVal;
}

export const convertSchedule = (check) => {
    let st = "";
    for (let i = 0; i < 24; ++i) {
        let value = 0;
        for (let j = 0; j < 4; ++j) {
            value = 2*value + ((check[i*4+j] === 1)? 1 : 0);
        }
        st += value.toString(16);
    }
    return st;
}

const INITIAL_STATE = { isFetching: true, node: 15, check: createSchedule()};

export const scheduleReducer = (state = INITIAL_STATE, action) => {
    if (action.type === 'DISPLAY_SCHEDULE') {
        console.log('DISPLAY_SCHEDULE', action);
        return {...state, isFetching: true, check: createSchedule()};
    }
    if (action.type === 'RECEIVED_SCHEDULE') {
        console.log('RECEIVED_SCHEDULE', action);
        return {...state, isFetching: false, check: action.payload};
    }
    if (action.type === 'TOGGLE_SCHEDULE') {
        console.log('state', state);
        console.log('action', action);
        let newState = {
            check: [
                ...state.check.slice(0,action.index),
                state.check[action.index] === 0 ? 1 : 0,
                ...state.check.slice(action.index+1)
            ]
        };
        fetch('/master/S'+action.node+':s' + convertSchedule(newState.check))
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                response.json().then(function(data) {
                    console.log('set schedule: ' + JSON.stringify(data));
                });
            });
        return newState;
    }
    return state;
}
