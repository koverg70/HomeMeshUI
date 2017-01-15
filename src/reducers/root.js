import { combineReducers } from 'redux'
import { settingsReducer } from './settings'
import { scheduleReducer }from './schedule'
import { sensorsReducer } from './sensors'

export const rootReducer = combineReducers(
    {
        settings: settingsReducer,
        schedule: scheduleReducer,
        sensors: sensorsReducer
    }
);
