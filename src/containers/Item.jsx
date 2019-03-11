import React, {Component} from 'react';
import axios from 'axios';

class Item extends Component{
	constructor(props){
		super(props);
		this.state = {
			items: []
		};
		this.getItems = this.getItems.bind(this);
	}

	getItems(){
		axios.get('http://localhost:3001/items').then((res) => {
			this.setState({
				items: res.data
			});
		})
	}

	render(){
		return(

		);
	}
}

export default Item;