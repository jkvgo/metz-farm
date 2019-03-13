import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class Price extends Component{
	constructor(props){
		UserSession.redirectToLogin();
		super(props);
		this.customerID = props.match.params.id ? props.match.params.id : 0;
        this.state = {
        	customer: {},
        	originalItems: [],
        	items: [],
        	loggedIn: UserSession.getLoggedID(),
        	newItem: {
        		item: "",
        		unit: "",
        		price: 0
        	},
        	addMode: false,
        	itemsReference: []
        };
        this.getCustomer = this.getCustomer.bind(this);
        this.getItemsReference = this.getItemsReference.bind(this);
        this.mapCustomerPrices = this.mapCustomerPrices.bind(this);

        this.addItem = this.addItem.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.submitNewItem = this.submitNewItem.bind(this);
        this.setNewItem = this.setNewItem.bind(this);
        this.setNewUnit = this.setNewUnit.bind(this);
        this.setNewPrice = this.setNewPrice.bind(this);
        this.getCustomer();
        this.getItemsReference();
	}

	getCustomer(){
		axios.get('http://localhost:3001/customers/'+this.customerID).then((res) => {
            this.setState({
                customer: res.data,
                addMode: false
            });
            this.mapCustomerPrices();
        });
	}

	getItemsReference(){
		axios.get('http://localhost:3001/items').then((res) => {
			this.setState({
				itemsReference: res.data
			});
		})
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

	addItem(){
		let allItems = this.state.items.length ? this.state.items : [];
		let newItem = this.state.newItem;
		allItems.push({
			type: "new"
		})
		newItem.item = "Jumbo";
		this.setState({
			items: allItems,
			addMode: true,
			newItem: newItem
		});
	}

	cancelEdit(){
		let allItems = this.state.items.length ? this.state.items : [];
		allItems.pop();
		this.setState({
			items: allItems,
			addMode: false,
			newItem: {
        		item: "",
        		unit: "",
        		price: 0
        	}
		});
	}

	submitNewItem(){
		const newItem = {
			item: this.refs.newItem.value,
			unit: this.refs.newUnit.value,
			price: this.state.newItem.price
		};
		const itemsReference = this.state.itemsReference.length ? this.state.itemsReference : [];
		const existingItems = this.state.items.length ? this.state.items : [];
		let itemID = itemsReference.filter((ir) => {
			return ir.item === newItem.item && ir.unit === newItem.unit;
		}).length ? itemsReference.filter((ir) => {
			return ir.item === newItem.item && ir.unit === newItem.unit;
		})[0].id : 0;
		let alreadyHasPrice = existingItems.find((i) => i.itemID === itemID);
		if(alreadyHasPrice){
			alert("This customer already has this price. Please update price instead");
		}else{
			let submitItem = {
				cust_id: this.customerID,
				item_id: itemID,
				price: newItem.price,
				loggedIn: this.state.loggedIn
			};
			axios.post('http://localhost:3001/addprice', submitItem).then((res) => {
				this.getCustomer();
			}).catch((err) => {
				alert("Unable to add prices");
			});
		}
	}

	setNewItem(val){
		const newItem = this.state.newItem ? this.state.newItem : {};
		newItem.item = val;
		this.setState({
			newItem: newItem
		});
	}

	setNewUnit(val){
		const newItem = this.state.newItem ? this.state.newItem : {};
		newItem.unit = val;
		this.setState({
			newItem: newItem
		});
	}

	setNewPrice(val){
		const newItem = this.state.newItem ? this.state.newItem : {};
		newItem.price = val;
		this.setState({
			newItem: newItem
		});
	}

	render(){
		const itemsReference = this.state.itemsReference.length ? this.state.itemsReference : [];
		const customer = this.state.customer ? this.state.customer : {};
		const newItem = this.state.newItem ? this.state.newItem : {};
		let uniqueItems = [];
		itemsReference.forEach((i) => {
			if(uniqueItems.indexOf(i.item) === -1){
				uniqueItems.push(i.item);
			}
		});
		// let unitsFromItem = this.state.unitFromItem.length ? this.state.unitFromItem.filter((i) => {}) : [];/
		let unitsFromItem = itemsReference.length ? itemsReference.filter((i) => {
			return i.item === newItem.item;
		}) : [];
		const itemElements = uniqueItems.length ? uniqueItems.map((u) => {
			return (
				<option key={u}>{u}</option>
			)
		}) : [];
		const unitElements = unitsFromItem.length ? unitsFromItem.map((ui) => {
			return (
				<option key={ui.unit}>{ui.unit}</option>
			)
		}) : [];
		const newItemPrice = this.state.newItem.price;
		const addMode = this.state.addMode;
		const itemPrices = this.state.items.length ? this.state.items.map((item, key) => {
			if(item.type === "new"){
				return (
					<tr key={key}>
						<td>
							<select ref="newItem" onChange={(e) => this.setNewItem(e.target.value)}>
								{itemElements}
							</select>
						</td>
						<td>
							<select ref="newUnit" onChange={(e) => this.setNewUnit(e.target.value)}>
								{unitElements}
							</select>
						</td>
						<td>
							<input type="number" value={newItemPrice} onChange={(e) => this.setNewPrice(e.target.value)}/>
						</td>
						<td></td>
						<td></td>
					</tr>
				);
			}else{
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
						<td className={"edit-controls " + item.status}>
							<button className="display-value" type="button" onClick={(e) => this.editPrice(item.id)}>Change Value</button>	
							<button className="update-value" type="button" onClick={(e) => this.updatePrice(item.id, item.itemID)}>Update Value</button>	
							<button className="update-value" type="button" onClick={(e) => this.revertPrice(item.id)}>Cancel</button>
						</td>
					</tr>
				);
			}
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
				<button type="button" className={"add-button " + addMode } onClick={() => this.addItem()}>Add Item</button>
				<button type="button" className={"cancel-button " + addMode } onClick={() => this.cancelEdit()}>Cancel</button>
                <button type="button" className={"submit-button " + addMode } onClick={() => this.submitNewItem()}>Submit</button>
				<Link to="/customer">Return to Customers</Link>
			</div>
		);
	}
}

export default Price;