/* eslint eqeqeq: 0 */

import React from 'react';
import { connect } from 'react-redux';
import './schedule.css';
import { loadValues } from './reducers/sensors'
import { Table, Row, Col } from 'react-bootstrap'

class Sensor extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.type}</td>
                <td>{this.props.value}</td>
                <td>{this.props.age}</td>
            </tr>
        );
    }
}

Sensor.propTypes = {
    name     : React.PropTypes.string.isRequired,
    type     : React.PropTypes.oneOf(['temp', 'humi']),
    value     : React.PropTypes.number,
    age     : React.PropTypes.number,
}

class Sensors extends React.Component {

    componentDidMount() {
        let that = this;
        that.props.loadValues();
        this.countdown = setInterval(() => that.props.loadValues(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.countdown);
    }

    findSensorNode(sensorList, v, i) {
        let sub = sensorList.filter((s) => s.n == v.node && s.t == v.sensor);
        let value = "N/A";
        let age = 0;
        if (sub.length == 1) {
            value = parseInt(sub[0].v, 10)/100;
            age = parseInt(sub[0].lu, 10);
        }
        let props = {key: 'key'+v.node+':'+v.sensor, name: v.name, type: v.type, value, age};
        return <Sensor {...props}/>
    }

    render() {
        let sensorList = this.props.sensorValues.sensors;
        let time = this.props.sensorValues.time;
        let settings = this.props.settings;
        if (Array.isArray(sensorList)) {
            return (
                <div>
                  <Row>
                    <Col lg={3} sm={6}>
                      <div><b>Érzékelők:</b> {time}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} sm={6}>
                      <Table striped bordered condensed hover>
                          <thead>
                            <tr>
                                <th>Eszköz</th>
                                <th>Érzékelő</th>
                                <th>Érték</th>
                                <th>Várakoz.</th>
                            </tr>
                          </thead>
                          <tbody>
                          {
                              settings.sensors.map((v, i) => {
                                  return this.findSensorNode(sensorList, v, i)
                              })
                          }
                          </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
            );
        } else {
            return (
                <div>Nem érthetők el az adatok.</div>
            )
        }
    }
}

Sensors.propTypes = {
    sensors     : React.PropTypes.object,
    settings    : React.PropTypes.object,
    loadValues : React.PropTypes.func.isRequired,
}

const mapDispatchToProps = {
    loadValues
}

const mapStateToProps = (state) => ({
    sensorValues : state.sensors,
    settings: state.settings
})

export const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
