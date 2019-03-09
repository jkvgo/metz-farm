import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';

class Price extends Component{
	constructor(props){
		super(props);
		this.customerID = props.match.params.id ? props.match.params.id : 0;
		this.customer = {
            id: 0,
            name: "Jason Marketing",
            price: {
                XL: { case: 200, tray: 100 },
                L: { case: 150, tray: 50 },
                M: { case: 100, tray: 20 }
            }
        }
        
        this.state = {
        	customer: {},
        	originalItems: [],
        	items: [],
        	loggedIn: 1
        };
        this.getCustomer = this.getCustomer.bind(this);
        this.mapCustomerPrices = this.mapCustomerPrices.bind(this);
        this.getCustomer();
        
	}

	getCustomer(){
		axios.get('http://localhost:3001/customers/'+this.customerID).then((res) => {
            this.setState({
                customer: res.data
            });
            this.mapCustomerPrices();
        });
	}

	mapCustomerPrices(){
		const customer = this.state.customer ? this.state.customer : {};
		let itemPriceMapping = [];
        let itemCounter = 0;
        let originalItems = [];
        for (var key in customer.price){
        	if(customer.price.hasOwnProperty(key)){
        		for(var key2 in customer.price[key]){
        			if(customer.price[key].hasOwnProperty(key2)){
        				itemPriceMapping.push({
        					id: itemCounter,
			    			item: key,
			    			unit: key2,
			    			value: customer.price[key][key2].price,
			    			itemID: customer.price[key][key2].id,
			    			modified: customer.price[key][key2].modified,
			    			status: "value-display",
			    		});
			    		itemCounter++;
        			}
        		}
        	}
        }
        
        itemPriceMapping.forEach((item) => {
        	originalItems.push({
        		id: item.id,
        		item: item.item,
        		unit: item.unit,
        		value: item.value,
        		status: item.status,
        		itemID: item.itemID,
        		modified: item.modified
        	});
        });
        this.setState({
        	originalItems: originalItems,
        	items: itemPriceMapping
        })
	}

	updateInput(id,value){
		let items = this.state.items.length ? this.state.items : [];
		let chosenItemIndex = items.findIndex(item => item.id === id);
		items[chosenItemIndex].value = value;
		this.setState({
			items: items
		});
	}

	editPrice(id){
		let items = this.state.items.length ? this.state.items : [];
		let chosenItemIndex = items.findIndex(item => item.id === id);
		items[chosenItemIndex].status = "value-edit";
		this.setState({
			items: items
		});
	}

	updatePrice(id, itemID){
		let agree = confirm("Are you sure you want to update the price?");
		if(agree == true){
			const customerID = this.state.customer ? this.state.customer.id : 0;
			const loggedIn = this.state.loggedIn ? this.state.loggedIn : 0;
			let items = this.state.items.length ? this.state.items : [];
			let refItems = this.state.originalItems.length ? this.state.originalItems : [];
			let chosenItemIndex = items.findIndex(item => item.id === id);
			items[chosenItemIndex].status = "value-display";
			refItems[chosenItemIndex].value = items[chosenItemIndex].value;
			let postBody = {
				customer: customerID,
				item: itemID,
				price: items[chosenItemIndex].value,
				loggedIn: loggedIn
			};
			axios.post('http://localhost:3001/price', postBody).then((res) => {
				this.getCustomer();
			}).catch((err) => {
				alert("Unable to update prices");
			});
		}
	}

	revertPrice(id){
		const originalItems = this.state.originalItems;
		let items = this.state.items.length ? this.state.items : [];
		let chosenItemIndex = items.findIndex(item => item.id === id);
		items[chosenItemIndex].status = "value-display";
		items[chosenItemIndex].value = originalItems[chosenItemIndex].value;
		
		this.setState({
			items: items
		});
	}

	render(){
		const customer = this.customer;
		const itemPrices = this.state.items.length ? this.state.items.map((item, key) => {
			return (
				<tr key={key}>
					<td>{item.item}</td>
					<td>{item.unit}</td>
					<td>
						<div className={item.status}>
							<b>{item.value}</b>
							<input type="number" placeholder={item.value} onChange={(e) => this.updateInput(item.id, e.target.value) } value={item.value} />
						</div>
					</td>
					<td>{item.modified}</td>
					<td className={item.status}>
						<button className="display-value" type="button" onClick={(e) => this.editPrice(item.id)}>Change Value</button>	
						<button className="update-value" type="button" onClick={(e) => this.updatePrice(item.id, item.itemID)}>Update Value</button>	
						<button className="update-value" type="button" onClick={(e) => this.revertPrice(item.id)}>Cancel</button>
					</td>
				</tr>
			);
		}) : [];
		return(
			<div id="price" className="center-container">
				<h3>{customer.name}</h3>
				<table>
					<thead>
						<tr>
							<th>Item</th>
							<th>Unit</th>
							<th>Price</th>
							<th>Changed By</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{itemPrices}
					</tbody>
				</table>
				<Link to="/customer">Return to Customers</Link>
			</div>
		);
	}
}

export default Price;