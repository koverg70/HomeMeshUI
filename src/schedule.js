/* eslint eqeqeq: 0 */

import React from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import './schedule.css';
import { createSchedule, checkItem,  initValues} from './reducers/schedule'
import { Table, Row, Col } from 'react-bootstrap'


const loadValues = (node) => {
    return (dispatch, getState) => {
        let state = getState();
        if (state.schedule.isFetching) {
            fetch('/master/S'+node+':g')
                .then(function(response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    response.json().then(function(data) {
                        if (parseInt(data.node, 10) !== parseInt(node, 10)) {
                            console.log('Invalid node. ' + data.node + '<>' + node);
                        } else if (data.status === 'OK') {
                            dispatch({type: 'RECEIVED_SCHEDULE', node, payload: createSchedule(data.schedule)});
                        } else {
                            console.log('Error received.');
                        }
                    });
                });
        }
    }
}

const ScheduleHour = (props) => {
    return <td>
        <div>
          <table width='100%'>
          <tbody>
          <tr>
          <td><input onChange={() => props.checkItem(props.start+0, props.params.node)} type="checkbox" checked={props.check[props.start+0] !== 0}/></td>
          <td><input onChange={() => props.checkItem(props.start+1, props.params.node)} type="checkbox" checked={props.check[props.start+1] !== 0}/></td>
          <td><input onChange={() => props.checkItem(props.start+2, props.params.node)} type="checkbox" checked={props.check[props.start+2] !== 0}/></td>
          <td><input onChange={() => props.checkItem(props.start+3, props.params.node)} type="checkbox" checked={props.check[props.start+3] !== 0}/></td>
          </tr>
          </tbody>
          </table>
        </div>
    </td>
}

const ScheduleHeader = (props) => {
    return <tr className='alt'>
        <td>{props.start/4+0}</td>
        <td>{props.start/4+1}</td>
        <td>{props.start/4+2}</td>
        <td>{props.start/4+3}</td>
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
        <Row>
          <Col lg={3} sm={6}>
            <span>Node: {props.params.node}</span>
          </Col>
        </Row>
        <Row>
          <Col lg={3} sm={6}>
            <Table striped bordered condensed hover>
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
            </Table>
          </Col>
        </Row>
        </div>;

    }
}

class PolledSchedule extends React.Component {
    componentDidMount() {
        this.reloadFromServer();
    }

    componentDidUpdate() {
        this.reloadFromServer();
    }

    reloadFromServer() {
        console.log('reloadFromServer: ' + this.prevNode + ', ' + this.props.params.node);
        if (this.prevNode != this.props.params.node) {
            if (this.countdown !== undefined) {
                clearInterval(this.countdown);
                this.countdown = undefined;
            }
            console.log('Init');
            this.props.initValues();
            this.prevNode = this.props.params.node;
            let that = this;
            let node = this.props.params.node;
            that.props.loadValues(node);
            this.countdown = setInterval(() => that.props.loadValues(node), 500);
        }
    }

    componentWillUnmount() {
        if (this.countdown !== undefined) {
            clearInterval(this.countdown);
            this.countdown = undefined;
        }
    }

    render() {
        return <Schedule {...this.props}/>
    }
}

export const ScheduleContainer = connect(
    (state) => ({ check: state.schedule.check, isFetching: state.schedule.isFetching }),
    {
        checkItem,
        initValues,
        loadValues
    }
)(PolledSchedule);
