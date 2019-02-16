import React, {Component} from 'react';

class Receipt extends Component{
    constructor(){
        super();
        this.state = {
            customer: "asd",
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
            }
        ];
        this.order= [];
    }
    
    chooseCustomer(){
        this.setState({
            customer: this.refs.chosenCustomer.value
        });
    }
    
    addOrder(e){
        let orders = this.state.orders;
        let item = this.refs.itemValue.value;
        let quantity = this.refs.itemQuantity.value;
        let unit = this.refs.itemUnit.value;
        orders.push({
            item: item,
            quantity: quantity,
            unit: unit
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
        const chosenCustomer = this.state.customer;
        const showSummary = this.state.showSummary;
        const orders = this.state.orders ? this.state.orders.map((ord, key) => {
            return (
                <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{ord.item}</td>
                    <td>{ord.quantity}</td>
                    <td>{ord.unit}</td>
                </tr>
            )
        }) : [];
        const customerNames = this.customers.map((cust, key) => {
            return (
                <option key={key}>{cust.name}</option>
            );
        });
        return(
            <div id="receipt-container" className="row center-container">
                <div className="column">
                    <h2>Create Order</h2>
                    <div className="row">
                        <h3>Customer: </h3>
                        <select ref="chosenCustomer" onChange={() => this.chooseCustomer()} >
                            {customerNames}
                        </select>
                    </div>
                    <h3>Order Details:</h3>
                    <div className="column">
                        <div className="row-no first-item">
                            <b>Item: </b>
                            <select ref="itemValue">
                                <option value="">----</option>
                                <option>XL</option>
                                <option>D</option>
                                <option>M</option>
                            </select>
                            <b>Quantity: </b>
                            <input type="number" ref="itemQuantity" placeholder="0"/>
                            <b>Unit: </b>
                            <select ref="itemUnit">
                                <option>Case</option>
                                <option>Tray</option>
                            </select>
                            <button type="button" onClick={(e) => this.addOrder()}>Add Order</button>
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
                            </tr>
                        </thead>
                        <tbody>
                            {orders}
                        </tbody>
                    </table>
                </div>
            </div>
                
        );
    }
}

export default Receipt;