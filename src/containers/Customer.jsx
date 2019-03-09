import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';

class Customer extends Component{
    constructor(props){
        super(props);
        this.state = {
            allCustomers: [],
            path: props.match.path
        };
        this.customers = [];
        this.getCustomers = this.getCustomers.bind(this);
        this.getCustomers();
    }

    getCustomers(){
        axios.get('http://localhost:3001/customers').then((res) => {
            this.setState({
                allCustomers: res.data
            });
        });
    }
    
    render(){
        const allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        const currentPath = this.state.path ? this.state.path : "";
        let customers = allCustomers.map((cust, key) => {
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
