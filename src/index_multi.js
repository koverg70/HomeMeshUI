import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
//import {Promise} from 'es6-promise';
import fetch from 'isomorphic-fetch';
import thunk from 'redux-thunk';
import './index.css';

const createSchedule = (schedule = undefined) => {
    let retVal = Array(96).fill().map((e,i)=>0); // array with 96 0-s in it
    if (schedule) {
        for (var i = 0; i < 24; ++i) {
            var value = parseInt(schedule.charAt(i), 16);
            for (var j = 3; j >= 0; --j) {
                var b = value % 2;
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

const convertSchedule = (check) => {
    var st = "";
    for (let i = 0; i < 24; ++i) {
        var value = 0;
        for (let j = 0; j < 4; ++j) {
            value = 2*value + ((check[i*4+j] === 1)? 1 : 0);
        }
        st += value.toString(16);
    }
    return st;
}

const loadValues = (node) => {
    return (dispatch, getState) => {
        let state = getState();
        if (state.isFetching) {
            fetch('http://10.0.0.190/S'+node+':g')
                .then(function(response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    response.json().then(function(data) {
                        if (parseInt(data.node, 10) !== parseInt(node, 10)) {
                            console.log('Invalid node: ' + data.node + ' <> ' + node);
                        } else if (data.status === 'OK') {
                            console.log('Correct node: ' + data.node);
                            dispatch({key: node, type: 'RECEIVED_SCHEDULE', payload: createSchedule(data.schedule)});
                        } else {
                            console.log('Error received.');
                        }
                    });
                });
        }
    }
}

const checkItem = (index, key) => (dispatch) => dispatch({type: 'TOGGLE_SCHEDULE', key, index});

const INITIAL_STATE = { isFetching: true, check: createSchedule()};

const reducer = (state = INITIAL_STATE, action) => {
    if (action.type === 'RECEIVED_SCHEDULE') {
        console.log('RECEIVED_SCHEDULE', action);
        return {...state, isFetching: false, check: action.payload};
    }
    if (action.type === 'TOGGLE_SCHEDULE') {
        console.log('state', state);
        console.log('action', action);
        let newState = {
            ...state,
            check: [
                ...state.check.slice(0,action.index),
                state.check[action.index] === 0 ? 1 : 0,
                ...state.check.slice(action.index+1)
            ]
        };
        fetch('http://10.0.0.190/S'+action.key+':s' + convertSchedule(newState.check))
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

const idMapReducerCreator = (reducerMap) => (state, action) => {
    let reducer = reducerMap[action.key];
    if (reducer !== undefined) {
        let substate = reducer(state, action);
        let key = action.key;
        return {[key]: substate};
    } else {
        return state;
    }
}

const store = createStore(idMapReducerCreator({1: reducer, 15: reducer}), INITIAL_STATE, applyMiddleware(thunk));

const ScheduleHour = (props) => {
    return <td>
        <span><input onChange={() => props.checkItem(props.start+0, props.key)} type="checkbox" checked={props.check[props.start+0] !== 0}/></span>
        <span><input onChange={() => props.checkItem(props.start+1, props.key)} type="checkbox" checked={props.check[props.start+1] !== 0}/></span>
        <span><input onChange={() => props.checkItem(props.start+2, props.key)} type="checkbox" checked={props.check[props.start+2] !== 0}/></span>
        <span><input onChange={() => props.checkItem(props.start+3, props.key)} type="checkbox" checked={props.check[props.start+3] !== 0}/></span>
    </td>
}

const ScheduleHeader = (props) => {
    return <tr>
        <th>{props.start/4+0}</th>
        <th>{props.start/4+1}</th>
        <th>{props.start/4+2}</th>
        <th>{props.start/4+3}</th>
    </tr>
}

const ScheduleRow = (props) => {
    return <tr>
        <ScheduleHour {...props} start={props.start+0*4}/>
        <ScheduleHour {...props} start={props.start+1*4}/>
        <ScheduleHour {...props} start={props.start+2*4}/>
        <ScheduleHour {...props} start={props.start+3*4}/>
    </tr>
}

const Schedule = (props) => {
    if (props.isFetching) {
        return <div>Loading data...</div>
    } else {
        return <div>
            <table id="temptable">
                <tbody>
                    <ScheduleHeader {...props} start={0*16}/>
                    <ScheduleRow {...props} start={0*16}/>
                    <ScheduleHeader {...props} start={1*16}/>
                    <ScheduleRow {...props} start={1*16}/>
                    <ScheduleHeader {...props} start={2*16}/>
                    <ScheduleRow {...props} start={2*16}/>
                    <ScheduleHeader {...props} start={3*16}/>
                    <ScheduleRow {...props} start={3*16}/>
                    <ScheduleHeader {...props} start={4*16}/>
                    <ScheduleRow {...props} start={4*16}/>
                    <ScheduleHeader {...props} start={5*16}/>
                    <ScheduleRow {...props} start={5*16}/>
                </tbody>
            </table>
        </div>;

    }
}

class PolledSchedule extends React.Component {
    componentDidMount() {
        //let dispatch = this.props.getDispatch();
        let that = this;
        //that.props.loadValues(this.props.node);
        console.log('Set interval:' + that.props.node * 200);
        this.countdown = setInterval(() => that.props.loadValues(that.props.node), that.props.node * 200);
    }

    componentWillUnmount() {
        clearInterval(this.countdown);
    }

    render() {
        return <Schedule {...this.props}/>
    }
}

const ScheduleContainer = connect(
    (state, ownProps) => {
        if (state.hasOwnProperty(ownProps.node)) {
            return { check: state[ownProps.node].check, isFetching: state[ownProps.node].isFetching }
        } else {
            return {...INITIAL_STATE};
        }
    },
    {
        checkItem,
        loadValues
    }
)(PolledSchedule);

class App extends Component {
    render() {
        return (
            <Provider store={

                store}>
                <div className="App">
                    <ScheduleContainer node="1"/>
                    <ScheduleContainer node="15"/>
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
