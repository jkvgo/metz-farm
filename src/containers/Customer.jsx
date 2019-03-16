import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class Customer extends Component{
    constructor(props){
        UserSession.redirectToLogin();
        super(props);
        this.state = {
            allCustomers: [],
            path: props.match.path,
            editMode: false,
            addCustomer: "",
            loggedIn: UserSession.getLoggedID()
        };
        this.customers = [];
        this.getCustomers = this.getCustomers.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.submitCustomer = this.submitCustomer.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.getCustomers();
    }

    getCustomers(){
        axios.get('customers').then((res) => {
            this.setState({
                allCustomers: res.data
            });
        });
    }

    addCustomer(){
        let allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        allCustomers.push({
            type: "new",
            name: "",
            id: ""
        });
        this.setState({
            allCustomers: allCustomers,
            editMode: true
        });
    }

    cancelEdit(){
        let allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        allCustomers.pop();
        this.setState({
            addCustomer: "",
            editMode: false,
            allCustomers: allCustomers
        });
    }

    typeCustomer(val){
        const typeValue = val;
        this.setState({
            addCustomer: typeValue
        });
    }

    submitCustomer(){
        const newCustomer = this.state.addCustomer.length ? this.state.addCustomer : "";
        const loggedIn = this.state.loggedIn;
        let customerDetails = {
            name: newCustomer,
            modified: loggedIn
        };
        let agree = confirm("Are you sure you want to create this new customer?");
        if(agree == true){
            axios.post('customers', customerDetails).then((res) => {
                this.getCustomers();
                this.setState({
                    editMode: false
                });    
            }).catch((err) => {
                alert("Unable to add customer");
            });
        }
    }
    
    render(){
        const allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        const currentPath = this.state.path ? this.state.path : "";
        const editMode = this.state.editMode;
        const addCustomer = this.state.addCustomer.length ? this.state.addCustomer : "";
        let customers = allCustomers.map((cust, key) => {
            return (
                <div className={"row customer-item just-between align-center "+cust.type} key={key}>
                    <p>{key+1}</p>
                    <input type="text" placeholder="Customer name" value={addCustomer} onChange={(e) => this.typeCustomer(e.target.value)} autoFocus={true}/>
                    <b className="customer-name">{cust.name}</b>
                    <Link to={`${currentPath}/price/${cust.id}`}>View Prices</Link>
                    <Link to={`${currentPath}/history/${cust.id}`}>View History</Link>
                </div>
            );
        });
        return(
            <div id="customer" className="column center-container">
                {customers}
                <div className={"row edit-controls just-end " + editMode}>
                    <button className="button add-button" onClick={() => this.addCustomer()}>Add Customer</button>
                    <button className="button cancel-button" onClick={() => this.cancelEdit()}>Cancel</button>
                    <button className="button submit-button" onClick={() => this.submitCustomer()}>Submit</button>
                </div>
            </div>
        );
    }
}

export default Customer;
