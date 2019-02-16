import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Receipt from './containers/Receipt';
import Customer from './containers/Customer';
import Report from './containers/Report';

const Routes = () => (
    <Router>
        <div>
            <nav id="navigation" className="row-no just-between align-center">
                <Link to="/" className="main-logo">
                    <h1>METZ FARM</h1>
                </Link>
                <ul className="main-nav">
                    <Link to="/">Receipt</Link>
                    <Link to="/customer">Customers</Link>
                    <Link to="/report">Report</Link>
                </ul>
            </nav>
            <Switch>
                <Route path="/" exact component={Receipt}/>
                <Route path="/customer" exact component={Customer}/>
                <Route path="/report" exact component={Report}/>
            </Switch>
        </div>
    </Router>
);

export default Routes;
