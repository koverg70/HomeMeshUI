import React from 'react';
import { Row, Col, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend}  from 'recharts'
import { loadData }  from './reducers/trends'

import moment from 'moment'
import 'moment/locale/hu'

moment.locale('hu')

export class TrendCurves extends React.Component {
  constructor() {
    super()
    this.state = {
      date: moment()
    }
  }

  changeDate = (days)  =>{
    console.log(days)
    this.setState({date: this.state.date.add(days, 'day')})
    loadData(this.state.date, this.setState.bind(this));
  }

  updateDimensions = () => {

     var w = window,
         d = document,
         documentElement = d.documentElement,
         body = d.getElementsByTagName('body')[0],
         width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
         height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

         this.setState({ width, height })
  }

  componentWillMount = () => {
      loadData(this.state.date, this.setState.bind(this))
      this.updateDimensions()
  }

  componentDidMount = () => {
      window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount = () => {
      window.removeEventListener("resize", this.updateDimensions);
  }

  render = () => {
    return (
        <Row>
          <ButtonToolbar>
            <ButtonGroup>
              <Button onClick={() => this.changeDate.bind(this)(-1)}><Glyphicon glyph="arrow-left" /></Button>
              <Button>{this.state.date.startOf('day').calendar() + ' - ' + this.state.date.endOf('day').calendar()}</Button>
              <Button onClick={() => this.changeDate.bind(this)(1)}><Glyphicon glyph="arrow-right" /></Button>
            </ButtonGroup>
          </ButtonToolbar>
          <Col>Trendgörbék ({this.state.width} x {this.state.height})</Col>
          <LineChart width={this.state.width} height={Math.max(400, this.state.height-200)} data={this.state.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis yAxisId="left" orientation="left" domain={[19, 31]} minTickGap={1} />
           <YAxis yAxisId="right" orientation="right" domain={[0, 100]}/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend verticalAlign="top" height={36}/>
           <Line yAxisId="right" isAnimationActive={false} strokeWidth={3} dot={false} type="linear" dataKey="1X" name='Fürdőszoba pára' stroke="#EFDFC5" />
           <Line yAxisId="right" isAnimationActive={false} strokeWidth={3} dot={false} type="linear" dataKey="11X" name='Napplai belső pára' stroke="#EFEABD" />
           <Line yAxisId="right" isAnimationActive={false} strokeWidth={3} dot={false} type="linear" dataKey="14X" name='Nappali pára'stroke="#EAEAC2" />
           <Line yAxisId="right" isAnimationActive={false} strokeWidth={3} dot={false} type="linear" dataKey="15X" name='Kazánház pára'stroke="#EFEFE0" />

           <Line yAxisId="left" isAnimationActive={false} strokeWidth={2} dot={false} type="linear" dataKey="1A" name='Fürdőszoba hő' stroke="#00A000" />
           <Line yAxisId="left" isAnimationActive={false} strokeWidth={2} dot={false} type="linear" dataKey="11A" name='Napplai belső hő' stroke="#202020" />
           <Line yAxisId="left" isAnimationActive={false} strokeWidth={2} dot={false} type="linear" dataKey="11B" name='Napplai padló hő' stroke="#802020" />
           <Line yAxisId="left" isAnimationActive={false} strokeWidth={2} dot={false} type="linear" dataKey="14A" name='Nappali hő' stroke="#000000" />
           <Line yAxisId="left" isAnimationActive={false} strokeWidth={2} dot={false} type="linear" dataKey="15A" name='Kazánház hő' stroke="#8080A0" />
          </LineChart>
        </Row>
    );
  }
}

TrendCurves.propTypes = {
    name     : React.PropTypes.string,
}
