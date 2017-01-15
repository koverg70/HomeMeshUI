import React from 'react';
import { Row, Col, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap'

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend}  from 'recharts'

import moment from 'moment'
import 'moment/locale/hu'

moment.locale('hu')

/*
const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
*/

export class TrendCurves extends React.Component {
  constructor() {
    super()
    this.state = {
      date: moment()
    }
  }

  convertChart(data) {
    let chart = []
    data.forEach((d) => {
      let col = {name: d.id}
      d.sensors.forEach((s) => {
        // n, t, v
        let n = s.n + s.t
        let v = parseInt(s.v, 10) / 100
        if (v > 0) {
          col = {...col, [n]: v }
        }
      })
      chart.push(col)
    })
    console.log(chart)
    return chart
  }

  loadData() {
    let self = this
    let url = '/trend_data/' + this.state.date.format('YYYY/MM/[day_]DD[.json]')

    console.log('Getting trend data: ' + url)

    fetch(url)
        .then((response) => {
            if (response.status >= 400) {
                self.setState({ error: 'Fetch error: ' + response.status, data: [] })
                return
            }
            response.json().then(function(data) {
                self.setState({ error: undefined, data: self.convertChart(data) })
                return
            });
        })
        .catch((err) => {
          self.setState({ error: 'Fetch error: ' + err, data: [] })
          return
        });
  }

  changeDate(days) {
    console.log(days)
    this.setState({date: this.state.date.add(days, 'day')})
    this.loadData();
  }

  componentWillMount() {
      this.loadData();
  }

  render() {
    return (
        <Row>
          <ButtonToolbar>
            <ButtonGroup>
              <Button onClick={() => this.changeDate.bind(this)(-1)}><Glyphicon glyph="arrow-left" /></Button>
              <Button>{this.state.date.startOf('day').calendar() + ' - ' + this.state.date.endOf('day').calendar()}</Button>
              <Button onClick={() => this.changeDate.bind(this)(1)}><Glyphicon glyph="arrow-right" /></Button>
            </ButtonGroup>
          </ButtonToolbar>
          <Col>Trendgörbék</Col>
          <LineChart width={1200} height={600} data={this.state.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis yAxisId="left" orientation="left" domain={['dataMin-1', 'dataMax+1']}/>
           <YAxis yAxisId="right" orientation="right" domain={['dataMin-1', 'dataMax+1']}/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend verticalAlign="top" height={36}/>
           <Line yAxisId="left" isAnimationActive={false} dot={false} type="linear" dataKey="1A" stroke="#8884d8" />
           <Line yAxisId="left" isAnimationActive={false} dot={false} type="linear" dataKey="11A" stroke="#82ca9d" />
           <Line yAxisId="left" isAnimationActive={false} dot={false} type="linear" dataKey="14A" stroke="#000000" />

           <Line yAxisId="right" isAnimationActive={false} dot={false} type="linear" dataKey="1X" stroke="#ff84d8" />
           <Line yAxisId="right" isAnimationActive={false} dot={false} type="linear" dataKey="11X" stroke="#ffca9d" />
           <Line yAxisId="right" isAnimationActive={false} dot={false} type="linear" dataKey="14X" stroke="#ff0000" />
          </LineChart>
        </Row>
    );
  }
}

TrendCurves.propTypes = {
    name     : React.PropTypes.string,
}
