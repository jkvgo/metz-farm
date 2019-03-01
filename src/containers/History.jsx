import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';

class History extends Component{
	constructor(props){
		super(props);
		this.customerID = props.match.params.id ? props.match.params.id : 0;
		this.customerName = "Jason Manufacturing";
		this.itemUnits = [
			{item: "XL", units: ["Case","Tray"]},
			{item: "L", units: ["Case","Tray"]},
			{item: "Jumbo", units: ["Case","Tray"]}
		];
		this.historyMapping = [];
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
        this.mapHistory();
	}

	mapHistory(){
		this.history.forEach((val, key) => {
			let row = [];
			row.push(val.modified);
			this.itemUnits.forEach((i) => {
				i.units.forEach((u) => {
					if(val.item === i.item && val.unit === u){
						row.push(val.price);
					}else{
						row.push("");
					}
				});
			});
			this.historyMapping.push(row);
		});
	}

	render(){
		const customerName = this.customerName;
		const historyMapping = this.historyMapping.length ? this.historyMapping.map((val, key) => {
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
		const tableItems = this.itemUnits.length ? this.itemUnits.map((val, key) => {
			return(
				<th colSpan={val.units.length} key={key}>
					{val.item}
				</th>
			)	
		}) : [];
		const tableUnits = this.itemUnits.length ? this.itemUnits.map((val, key) => {
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
							<td rowSpan="2"></td>
							{tableItems}
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