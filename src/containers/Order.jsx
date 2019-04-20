import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class Order extends Component{
	constructor(props){
		UserSession.redirectToLogin()
		super(props);
		this.state = {
			orders: [],
			path: props.match.path,
			deleteMode: "default",
			deletePass: ""
		};

		this.deletePass = "joeytan";
		this.getOrders = this.getOrders.bind(this);
		this.deleteOrder = this.deleteOrder.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.cancelConfirmDelete = this.cancelConfirmDelete.bind(this);
		this.updatePass = this.updatePass.bind(this);
		this.getOrders();
	}

	getOrders(){
		axios.get('orders').then((res) => {
            this.setState({
                orders: res.data
            });
        });
	}

	deleteOrder(e,id){
		e.preventDefault();
		this.setState({
			deleteMode: id
		});
	}

	cancelConfirmDelete(e){
		e.preventDefault();
		this.setState({
			deleteMode: "default",
			deletePass: ""
		});
	}

	confirmDelete(e,id){
		e.preventDefault();
		const deletePass = this.state.deletePass;
		if(deletePass === this.deletePass){
			let agree = confirm("Are you sure you want to delete this order?");
			if(agree){
				axios.delete('orders/'+id).then((res) => {
					this.getOrders();
				});
			}
		}else{
			alert("Invalid password!");
		}
	}

	updatePass(value){
		this.setState({
			deletePass: value
		});
	}

	render(){
		const deleteMode = this.state.deleteMode;
		const deletePass = this.state.deletePass;
		const currentPath = this.state.path ? this.state.path : "";
		const orders = this.state.orders.length ? this.state.orders.map((o, key) => {
			let deleteModeClass = o.id === deleteMode ? "delete" : "default";
			return(
				<tr key={key}>
					<td>{o.id}</td>
					<td>{o.customer}</td>
					<td>{o.username}</td>
					<td>{o.created}</td>
					<td className={deleteModeClass}>
						<Link to={`${currentPath}/${o.id}`}>View Order Details</Link>
						<a href="#" onClick={(e) => this.deleteOrder(e,o.id)}>Delete</a>
						<input className={"delete-mode"} type="password" value={deletePass} onChange={(e) => this.updatePass(e.target.value)}/>
						<a className={"delete-mode"} href="#" onClick={(e) => this.confirmDelete(e, o.id)}>Confirm</a>
						<a className={"delete-mode"} href="#" onClick={(e) => this.cancelConfirmDelete(e)}>Cancel</a>
					</td>
				</tr>
			);
		}) : [];
		return(
			<div id="orders" className="column center-container">
				<table>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Customer</th>
							<th>Created By</th>
							<th>Created On</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders}
					</tbody>
				</table>
			</div>
		)
	}
}

export default Order;