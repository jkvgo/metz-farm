import React, {Component} from 'react';
import UserSession from '../UserSession';
import axios from 'axios';

class Item extends Component{
	constructor(props){
		UserSession.redirectToLogin()
		super(props);
		this.state = {
			items: [],
			newItemName: "",
			newItemUnit: "",
			addMode: false,
			loggedIn: UserSession.getLoggedID()
		};
		this.getItems = this.getItems.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.addItem = this.addItem.bind(this);
		this.submitItem = this.submitItem.bind(this);
		this.cancelAdd = this.cancelAdd.bind(this);
		this.getItems();
	}

	getItems(){
		axios.get('items').then((res) => {
			this.setState({
				items: res.data,
				addMode: false
			});
		})
	}

	deleteItem(){
		let agree = confirm("Are you sure you want to delete this item?");
		if(agree){
		}
	}

	addItem(e){
		let items = this.state.items.length ? this.state.items : [];
		items.push({
			type: "new"
		});
		this.setState({
			items: items,
			addMode: true
		});
		e.preventDefault();
	}

	changeNewItem(val){
		this.setState({
			newItemName: val
		});
	}

	changeNewUnit(val){
		this.setState({
			newItemUnit: val
		});
	}

	submitItem(){
		const newItemName = this.state.newItemName;
		const newItemUnit = this.state.newItemUnit;
		const loggedIn = this.state.loggedIn;
		const newItem = {
			item: newItemName,
			unit: newItemUnit,
			loggedIn: loggedIn
		};
		axios.post('item', newItem).then((res) => {
			this.getItems();
		}).catch((err) => {
			alert("Unable to add item");
		})
	}

	cancelAdd(){
		let items = this.state.items.length ? this.state.items : [];
		items.pop();
		this.setState({
			newItemName: "",
			newItemUnit: "",
			addMode: false,
			items: items
		});
	}

	render(){
		const newItemName = this.state.newItemName;
		const newItemUnit = this.state.newItemUnit;
		const addMode = this.state.addMode;
		const items = this.state.items.length ? this.state.items.map((i, key) => {
			if(i.type === "new"){
				return (
					<div className="row just-between align-center item-row" key={key}>
						<p>{key+1}</p>
						<div>
							<input type="text" value={newItemName} onChange={(e) => this.changeNewItem(e.target.value)} autoFocus={true}/>
						</div>
						<div>
							<input type="text" value={newItemUnit} onChange={(e) => this.changeNewUnit(e.target.value)}/>
						</div>
					</div>
				)
			}else{
				return (
					<div className={"row just-between align-center item-row"} key={key}>
						<p>{key+1}</p>
						<b className="item-name">{i.item}</b>
						<p className="item-unit">{i.unit}</p>
					</div>
				)
			}
		}) : [];
		return(
			<div id="item" className="column center-container">
				{items}
				<div className={"row just-end item-control " + addMode}>
					<a href="#" className="add-item" onClick={(e) => this.addItem(e)}>Add Item</a>
					<a href="#" className="submit-item" onClick={(e) => this.submitItem()}>Submit</a>
					<a href="#" className="submit-item" onClick={(e) => this.cancelAdd()}>Cancel</a>
				</div>
			</div>
		);
	}
}

export default Item;