import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';

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
        this.itemPriceMapping = [];
        this.itemCounter = 0;
        for (var key in this.customer.price){
        	if(this.customer.price.hasOwnProperty(key)){
        		for(var key2 in this.customer.price[key]){
        			if(this.customer.price[key].hasOwnProperty(key2)){
        				this.itemPriceMapping.push({
        					id: this.itemCounter,
			    			item: key,
			    			unit: key2,
			    			value: this.customer.price[key][key2],
			    			status: "value-display"
			    		});
			    		this.itemCounter++;
        			}
        		}
        	}
        }
        this.originalItems = [];
        this.itemPriceMapping.forEach((item) => {
        	this.originalItems.push({
        		id: item.id,
        		item: item.item,
        		unit: item.unit,
        		value: item.value,
        		status: item.status
        	});
        });
        this.state = {
        	originalItems: this.originalItems,
        	items: this.itemPriceMapping
        };
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

	updatePrice(id){
		let agree = confirm("Are you sure you want to update the price?");
		if(agree == true){
			let items = this.state.items.length ? this.state.items : [];
			let refItems = this.state.originalItems.length ? this.state.originalItems : [];
			let chosenItemIndex = items.findIndex(item => item.id === id);
			items[chosenItemIndex].status = "value-display";
			refItems[chosenItemIndex].value = items[chosenItemIndex].value;
			this.setState({
				items: items,
				originalItems: refItems
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
					<td>JK</td>
					<td className={item.status}>
						<button className="display-value" type="button" onClick={(e) => this.editPrice(item.id)}>Change Value</button>	
						<button className="update-value" type="button" onClick={(e) => this.updatePrice(item.id)}>Update Value</button>	
						<button className="update-value" type="button" onClick={(e) => this.revertPrice(item.id)}>Cancel</button>
					</td>
				</tr>
			);
		}) : [];
		return(
			<div id="price-container" className="center-container">
				<h2>{customer.name}</h2>
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