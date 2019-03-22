import React, {Component} from 'react';
import axios from 'axios';

class Details extends Component{
	constructor(props){
		super(props);
		this.orderID = props.match.params.id ? props.match.params.id : 0;
		this.state = {
			details: []
		};
		this.getOrderDetails = this.getOrderDetails.bind(this);
		this.getOrderDetails();
	}

	getOrderDetails(){
		axios.get("http://localhost:3001/orders/"+this.orderID).then((res) => {
			this.setState({
				details: res.data
			});
			console.log(this.state.details);
		})
	}

	render(){
		return(
			<div></div>
		)
	}
}

export default Details;