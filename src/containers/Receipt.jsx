import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class Receipt extends Component{
    constructor(){
        super();
        this.state = {
            allCustomers: [],
            customer: "",
            item: "",
            orders: [],
            showSummary: "hide"
        };
        this.customers = [
            {
                id: 0,
                name: "----------"
            },
            {
                id: 1,
                name: "Jason Marketing",
                price: {
                    XL: { case: 200, tray: 100 },
                    L: { case: 150, tray: 50 },
                    M: { case: 100, tray: 20 }
                }
            },
            {
                id: 2,
                name: "SBJ Tracking",
                price: {
                    goodCrackBig: { case: 50 },
                    juice: { case: 15 },
                    plasticEgg: { kilo: 10 }
                }
            },
            {
                id: 3,
                name: "SBJ Tracking",
                price: {
                    goodCrackBig: { case: 50 },
                    juice: { case: 15 },
                    plasticEgg: { kilo: 10 }
                }
            }
        ];
        this.order = [];
        this.getCustomers = this.getCustomers.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
        this.getCustomers();
    }

    getCustomers(){
        // let customers = [];
        axios.get('http://localhost:3001/customers').then((res) => {
            this.setState({
                allCustomers: res.data,
                customer: res.data[0].name
            });
        });
    }
    
    chooseCustomer(){
        this.setState({
            customer: this.refs.chosenCustomer.value,
            item: ""
        });
        this.refs.itemQuantity.value = "";
    }

    chooseItem(){
        this.setState({
            item: this.refs.itemValue.value
        });
    }
    
    addOrder(e){
        const allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        const chosenCustomer = this.state.customer;
        let customerDetails = this.allCustomers.find((cust) => {
            return cust.name === chosenCustomer
        });

        let orders = this.state.orders;

        let item = this.refs.itemValue.value;
        let quantity = this.refs.itemQuantity.value;
        let unit = this.refs.itemUnit.value;
        let price = customerDetails.price[item][unit.toLowerCase()];
        let totalPrice = price * quantity;

        orders.push({
            item: item,
            quantity: quantity,
            unit: unit,
            price: price,
            totalPrice: totalPrice
        });
        this.setState({
            orders: orders,
            showSummary: "show"
        });
        this.refs.itemValue.value = "";
        this.refs.itemQuantity.value = "";
        this.refs.itemUnit.value = "";
    }

    render(){
        const allCustomers = this.state.allCustomers.length ? this.state.allCustomers : [];
        const chosenCustomer = this.state.customer;
        const chosenItem = this.state.item;
        const showSummary = this.state.showSummary;
        const items = allCustomers.find(cust => cust.name === chosenCustomer) ? 
        Object.keys(allCustomers.find(cust => cust.name === chosenCustomer).price).map((k) => {
            return (
                <option key={k}>{k}</option>
            );
        }) : [];
        const unitsArray = allCustomers.find(cust => cust.name === chosenCustomer) && chosenItem ? Object.keys(allCustomers.find(cust => cust.name === chosenCustomer).price[chosenItem]) : [];
        const units = unitsArray.length ? unitsArray.map((u) => {
            return (
                <option key={u}>{u}</option>
            );
        }) : [];
        const orders = this.state.orders ? this.state.orders.map((ord, key) => {
            return (
                <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{ord.item}</td>
                    <td>{ord.quantity}</td>
                    <td>{ord.unit}</td>
                    <td>{ord.price}</td>
                    <td>{ord.totalPrice}</td>
                </tr>
            )
        }) : [];
        const customerNames = allCustomers.map((cust, key) => {
            return (
                <option key={key}>{cust.name}</option>
            );
        });
        return(
            <div id="receipt" className="row center-container">
                {UserSession.redirectToLogin()}
                <div className="column">
                    <h2>Create Order</h2>
                    <div className="row align-center customer-container">
                        <h3>Customer: </h3>
                        <select ref="chosenCustomer" onChange={() => this.chooseCustomer()} >
                            {customerNames}
                        </select>
                    </div>
                    <h3>Order Details:</h3>
                    <div className="column">
                        <div className="column-no first-item">
                            <div className="form-item">
                                Item:
                                <select ref="itemValue" onChange={() => this.chooseItem()}>
                                    <option value="">----</option>
                                    {items}
                                </select>
                            </div>
                            <div className="form-item">
                                Quantity:
                                <input type="number" ref="itemQuantity" placeholder="0"/>
                            </div>
                            <div className="form-item">
                                Unit:
                                <select ref="itemUnit">
                                    {units}
                                </select>
                            </div>
                            <button className="add-button" type="button" onClick={(e) => this.addOrder()}>Add Order</button>
                        </div>
                    </div>
                </div>
                <div className={"order-display "+showSummary}>
                    <h2>{chosenCustomer}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Price per Unit</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders}
                        </tbody>
                    </table>
                    <div className="row just-end order-button">
                        <button type="button">Submit Order</button>
                    </div>
                </div>
            </div>
                
        );
    }
}

export default Receipt;