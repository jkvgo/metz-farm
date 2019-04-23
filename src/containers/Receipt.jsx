import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class Receipt extends Component{
    constructor(){
        UserSession.redirectToLogin();
        super();
        this.state = {
            allCustomers: [],
            customer: "",
            item: "",
            orders: [],
            showSummary: "hide",
            loggedIn: UserSession.getLoggedID(),
            chosenItemQuantity: 1
        };
        this.order = [];
        this.getCustomers = this.getCustomers.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
        this.removeOrder = this.removeOrder.bind(this);
        this.getCustomers();
    }

    submitOrder(){
        const orders = this.state.orders;
        const loggedIn = this.state.loggedIn;
        let loggedInName;
        axios.get("users/"+loggedIn).then((res) => {
            loggedInName =  res.data[0].name;
            let agree = confirm("Are you sure you want to submit this order " + loggedInName + "?");
            if(agree){
                axios.post("orders", orders).then((res) => {
                    if(res.status === 200){
                        alert(res.data);
                        this.getCustomers();
                    }else{
                        alert("Unable to submit order");
                    }
                });    
            }
        });
    }

    getCustomers(){
        axios.get('customers').then((res) => {
            this.setState({
                allCustomers: res.data,
                customer: res.data[0].name,
                showSummary: "hide",
                item: ""
            });
        });
    }
    
    chooseCustomer(){
        this.setState({
            customer: this.refs.chosenCustomer.value,
            item: "",
            orders: [],
            chosenItemQuantity: 1
        });
        // this.refs.itemQuantity.value = "";
    }

    chooseItem(){
        this.setState({
            item: this.refs.itemValue.value
        });
    }
    
    addOrder(e){
        const allCustomers = this.state.allCustomers ? this.state.allCustomers : [];
        const loggedIn = this.state.loggedIn;
        const chosenCustomer = this.state.customer;
        let customerDetails = allCustomers.find((cust) => {
            return cust.name === chosenCustomer
        });

        let orders = this.state.orders;

        let item = this.refs.itemValue.value;
        let quantity = this.state.chosenItemQuantity;
        if(quantity > 0 && item !== ""){
            let unit = this.refs.itemUnit.value;
            let price = customerDetails.price[item][unit].price;
            let itemID = customerDetails.price[item][unit].id;
            let totalPrice = price * quantity;
            orders.push({
                custID: customerDetails.id,
                loggedIn: loggedIn,
                item: item,
                quantity: quantity,
                unit: unit,
                price: price,
                totalPrice: totalPrice,
                itemID: itemID
            });
            this.setState({
                orders: orders,
                showSummary: "show",
                chosenItemQuantity: 1
            });
            this.refs.itemValue.value = "";
            this.refs.itemUnit.value = "";
        }   
    }

    removeOrder(key){
        let orders = this.state.orders;
        let showSummary = "show";
        orders.splice(key,1);
        if(orders.length === 0){
            showSummary = "hide";
        }
        this.setState({
            orders: orders,
            showSummary: showSummary
        });
    }

    changeQuantity(val){
        // if(val >= 1){
            this.setState({
                chosenItemQuantity: val
            });
        // }
    }

    render(){
        const itemQuantity = this.state.chosenItemQuantity;
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
                    <td onClick={() => this.removeOrder(key) }>X</td>
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
                <div className="column order-form">
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
                                <input type="number" value={itemQuantity} placeholder="1" onChange={(e) => this.changeQuantity(e.target.value)}/>
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
                    <h2>Order Summary for: {chosenCustomer}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Price per Unit</th>
                                <th>Total Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders}
                        </tbody>
                    </table>
                    <div className="row just-end order-button">
                        <button type="button" onClick={(e) => this.submitOrder()}>Submit Order</button>
                    </div>
                </div>
            </div>
                
        );
    }
}

export default Receipt;