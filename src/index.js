import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import { ScheduleContainer } from './schedule';
import { SensorsContainer } from './sensors';
import { TrendCurves } from './trends';
import { rootReducer } from './reducers/root'

import { settingsChange } from './reducers/settings'

import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { Panel, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

fetch('automation_config.json')
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        response.text().then(function(data) {
            //console.log(data);
            let action = settingsChange(JSON.parse(data));
            store.dispatch(action);
        });
    });

const AppFrame = (props) => {
    return <Panel>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">SmartHome v2</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav  bsStyle="pills" activeKey={1}>
            <IndexLinkContainer to='/'>
              <NavItem eventKey={1} href="/">Nyitólap</NavItem>
            </IndexLinkContainer>
            <LinkContainer to={'/schedule/1'}>
              <NavItem eventKey={2}>Szellőző</NavItem>
            </LinkContainer>
            <LinkContainer to={'/schedule/15'}>
              <NavItem eventKey={3}>Fűtés</NavItem>
              </LinkContainer>
            <LinkContainer to={'/sensors'}>
              <NavItem eventKey={4}>Érzékelők</NavItem>
            </LinkContainer>
            <LinkContainer to={'/trends'}>
              <NavItem eventKey={5}>Trendgörbék</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={6} title="Egyebek" id="basic-nav-dropdown">
              <MenuItem eventKey={6.1}>Action</MenuItem>
              <MenuItem eventKey={6.2}>Another action</MenuItem>
              <MenuItem eventKey={6.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={6.4}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={7} href="#">Bejelentkezés</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {props.children}
    </Panel>
}

const Home = () => {
    return <div>Ez a nyitólap</div>
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={AppFrame}>
                        <IndexRoute component={Home}/>
                        <Router path="/schedule/:node" component={ScheduleContainer}/>
                        <Router path="/sensors" component={SensorsContainer}/>
                        <Router path="/trends" component={TrendCurves}/>
                    </Route>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
