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
        this.order= [];
    }
    
    chooseCustomer(){
        this.setState({
            customer: this.refs.chosenCustomer.value
        });
    }
    
    addOrder(e){
        const chosenCustomer = this.state.customer;
        let customerDetails = this.customers.find((cust) => {
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
        const chosenCustomer = this.state.customer;
        const showSummary = this.state.showSummary;
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
        const customerNames = this.customers.map((cust, key) => {
            return (
                <option key={key}>{cust.name}</option>
            );
        });
        return(
            <div id="receipt" className="row center-container">
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
                                <select ref="itemValue">
                                    <option value="">----</option>
                                    <option>XL</option>
                                    <option>D</option>
                                    <option>M</option>
                                </select>
                            </div>
                            <div className="form-item">
                                Quantity:
                                <input type="number" ref="itemQuantity" placeholder="0"/>
                            </div>
                            <div className="form-item">
                                Unit:
                                <select ref="itemUnit">
                                    <option>Case</option>
                                    <option>Tray</option>
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