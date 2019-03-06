import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';

class Customer extends Component{
    constructor(props){
        super(props);
        this.state = {
            path: props.match.path
        };
        this.customers = [
            {
                id: 0,
                name: "Jason Marketing",
                price: {
                    XL: { case: 200, tray: 100 },
                    L: { case: 150, tray: 50 },
                    M: { case: 100, tray: 20 }
                }
            },
            {
                id: 1,
                name: "SBJ Tracking",
                price: {
                    goodCrackBig: { case: 50 },
                    juice: { case: 15 },
                    plasticEgg: { kilo: 10 }
                }
            }
        ];
        this.customers = [];
        this.getCustomers = this.getCustomers.bind(this);
        this.getCustomers();
    }

    getCustomers(){
        axios.get('http://localhost:3001/customers').then((res) => {
            console.log(res);
        });
    }
    
    render(){
        const currentPath = this.state.path ? this.state.path : "";
        let customers = this.customers.map((cust, key) => {
            return (
                <div className="row customer-item just-between align-center" key={key}>
                    <p>{key+1}</p>
                    <b className="customer-name">{cust.name}</b>
                    <Link to={`${currentPath}/price/${cust.id}`}>View Prices</Link>
                    <Link to={`${currentPath}/history/${cust.id}`}>View History</Link>
                </div>
            );
        });
        return(
            <div id="customer" className="column center-container">
                {customers}
            </div>
        );
    }
}

export default Customer;
