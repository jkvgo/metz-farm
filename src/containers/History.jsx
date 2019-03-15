import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import UserSession from '../UserSession';
import axios from 'axios';

class History extends Component{
	constructor(props){
		UserSession.redirectToLogin()
		super(props);
		this.customerID = props.match.params.id ? props.match.params.id : 0;
		this.historyMapping = [];
		this.state = {
			customerName: "",
			history: [],
			historyMapping: [],
			itemUnits: []
		};
		this.history = [
            {
            	cust_id: 0,
            	item: "XL",
            	unit: "Case",
            	price: 200,
            	modified: "2019-01-20",
            	modified_by: "JK"
            },
            {
            	cust_id: 0,
            	item: "XL",
            	unit: "Tray",
            	price: 180,
            	modified: "2019-01-22",
            	modified_by: "JK"
            },
            {
            	cust_id: 0,
            	item: "L",
            	unit: "Case",
            	price: 140,
            	modified: "2019-01-25",
            	modified_by: "Gara"
            },
            {
            	cust_id: 0,
            	item: "L",
            	unit: "Tray",
            	price: 150,
            	modified: "2019-01-29",
            	modified_by: "JK"
            },
            {
            	cust_id: 0,
            	item: "M",
            	unit: "Case",
            	price: 120,
            	modified: "2019-02-04",
            	modified_by: "Metz"
            }
        ];
        this.mapHistory = this.mapHistory.bind(this);
        this.getItems = this.getItems.bind(this);
        this.mapHistory();
	}

	getItems(history){
		let allItems = [];
		history.forEach((hist) => {
			if(allItems.find(item => item.item === hist.item)){
				if(!allItems.find(item => item.item === hist.item).units.find(unit => unit === hist.unit)){
					allItems.find(item => item.item === hist.item).units.push(hist.unit);
				}
			}else{
				allItems.push({
					item: hist.item,
					units: [hist.unit]
				});
			}
		});
		return allItems;
	}

	mapHistory(){
		let itemUnits = [], customerName;
		axios.get('http://localhost:3001/history/' + this.customerID).then((res) => {
			itemUnits = this.getItems(res.data);
			customerName = res.data.length ? res.data[0].name : "There is no history yet for this customer";
			let historyMapping = [];
			res.data.forEach((val, key) => {
				let row = [];
				row.push(val.modified);
				itemUnits.forEach((i) => {
					i.units.forEach((u) => {
						if(val.item === i.item && val.unit === u){
							row.push(val.price);
						}else{
							row.push("");
						}
					});
				});
				row.push(val.modified_name);
				historyMapping.push(row);
			});
			this.setState({
				historyMapping: historyMapping,
				itemUnits: itemUnits,
				customerName: customerName
			});
		});
	}

	render(){
		const customerName = this.state.customerName.length ? this.state.customerName : "";
		const historyMapping = this.state.historyMapping.length ? this.state.historyMapping.map((val, key) => {
			return(
				<tr key={key}>
				{
					val.map((val2,key2) => {
						return(
							<td key={key+key2}>{val2}</td>
						)
					})
				}
				</tr>
			)
		}) : [];
		const tableItems = this.state.itemUnits.length ? this.state.itemUnits.map((val, key) => {
			return(
				<th colSpan={val.units.length} key={key}>
					{val.item}
				</th>
			)	
		}) : [];
		const tableUnits = this.state.itemUnits.length ? this.state.itemUnits.map((val, key) => {
			return(
				val.units.map((val2) => {
					return(
						<th key={val.item+val2} className="column-subhead">
							{val2}
						</th>
					)
				})
			)
		}) : [];

		return(
			<div id="history" className="center-container">
				<h2>{customerName}</h2>
				<table>
					<thead>
						<tr>
							<th rowSpan="2" className="left-text">Modified On</th>
							{tableItems}
							<th rowSpan="2" className="left-text">Modified By</th>
						</tr>
						<tr>
							{tableUnits}
						</tr>
					</thead>
					<tbody>
						{historyMapping}
					</tbody>
				</table>
			</div>
		);
	}
}

export default History;