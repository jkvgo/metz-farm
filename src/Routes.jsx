import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Receipt from './containers/Receipt';
import Customer from './containers/Customer';
import Report from './containers/Report';
import Price from './containers/Price';
import History from './containers/History';
import Login from './containers/Login';
import Item from './containers/Item';
import User from './containers/User';
import Order from './containers/Order';
import Details from './containers/Details';

import UserSession from './UserSession';

function logout(){
    UserSession.setLoggedOut();
    window.location.replace("/login");
}

// function redirectToLogin(){
//     const session = UserSession.getStatus();
//     if(!session){
//         return <Redirect to="/login"/>    
//     }
// }

function returnTabs(){
    const status = UserSession.getStatus();
    if(status === "true"){
        return (
            <ul className="main-nav">
                <Link to="/">Receipt</Link>
                <Link to="/order">Orders</Link>
                <Link to="/customer">Customers</Link>
                <Link to="/report">Report</Link>
                <a href="#" onClick={() => logout()}>Log-out</a>
            </ul>
        );
    }else{
        return ""
    }
}

const Routes = () => (
    <Router>
        <div>
            {/*{redirectToLogin()}*/}
            <nav id="navigation" className="row-no just-between align-center">
                <Link to="/" className="main-logo">
                    <h1>METZ FARM</h1>
                </Link>
                {returnTabs()}
            </nav>
            <Switch>
                <Route path="/receipt" exact component={Receipt}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/customer" exact component={Customer}/>
                <Route path="/report" exact component={Report}/>
                <Route path="/item" exact component={Item}/>
                <Route path="/user" exact component={User}/>
                <Route path="/order" exact component={Order}/>
                <Route exact path="/order/:id" component={Details}/>
                <Route exact path="/customer/price/:id" component={Price}/>
                <Route exact path="/customer/history/:id" component={History}/>
                <Route component={Receipt}/>
            </Switch>
        </div>
    </Router>
);

export default Routes;
