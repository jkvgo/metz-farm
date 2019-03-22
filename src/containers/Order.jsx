import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Order extends Component{
	constructor(props){
		super(props);
		this.state = {
			orders: [],
			path: props.match.path
		};

		this.getOrders = this.getOrders.bind(this);
		this.getOrders();
	}

	getOrders(){
		axios.get('http://localhost:3001/orders').then((res) => {
            this.setState({
                orders: res.data
            });
        });
	}

	render(){
		const currentPath = this.state.path ? this.state.path : "";
		const orders = this.state.orders.length ? this.state.orders.map((o, key) => {
			return(
				<tr key={key}>
					<td>{o.id}</td>
					<td>{o.customer}</td>
					<td>{o.username}</td>
					<td>{o.created}</td>
					<td>
						<Link to={`${currentPath}/${o.id}`}>View Order Details</Link>
					</td>
				</tr>
			);
			// return(
			// 	<div className="row order-item just-between align-center" key={key}>
   //                  <p>{o.id}</p>
   //                  <b className="customer-name">{o.customer}</b>
   //                  <Link to={`${currentPath}/order/${o.id}`}>View Order Details</Link>
   //              </div>
			// )
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