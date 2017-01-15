import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

const reducer = (state = 0, action) => {
    if (action.type === 'SET_COUNTER') {
        return action.value;
    }
    if (action.type === 'INCREMENT') {
        return state + 1;
    }
    if (action.type === 'DECREMENT') {
        return state - 1;
    }
    console.log('Reducer called.');
    return state;
}

const store = createStore(reducer, 0);

const Counter = (props) => {
    return <div>
        <p>Count: {props.count}</p>
        <p>
            <button onClick={props.increment}>Increment</button>
            <button onClick={props.decrement}>Decrement</button>
            <button onClick={() => props.setValueTo(props.initValue)}>Reset to {props.initValue}</button>
        </p>
    </div>;
}

const CounterContainer = connect(
    (state) => ({ count: state, initValue: 80 }),
    (dispatch) => ({
        increment: () =>  dispatch({type: 'INCREMENT'}),
        decrement: () =>  dispatch({type: 'DECREMENT'}),
        setValueTo: (value) => dispatch({type: 'SET_COUNTER', value: value})
    })
)(Counter);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <CounterContainer/>
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
