import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import jsPDF from 'jspdf';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';

class Report extends Component{
    constructor(props){
        super(props);
        this.state = {
        	startDate: new Date(),
        	endDate: new Date(),
        	receipts: []
        };
        this.receipts = [
        	{ 
        		receiptID: "DR00001", 
        		customer: "JK", 
        		orders: [ 
        			{item: "XL", quantity: 2, unit: "Case", price: 250, total: 500 },
        			{item: "L", quantity: 3, unit: "Tray", price: 400, total: 1200 }
        		]
        	},
        	{ 
        		receiptID: "DR00021", 
        		customer: "Metz", 
        		orders:[ 
        			{ item: "Jumbo", quantity: 10, unit: "Tray", price: 1000, total: 10000 }
        		]
        	},
        	{ 
        		receiptID: "DR01341", 
        		customer: "Dom", 
        		orders: [
        			{item: "M", quantity: 25, unit: "Case", price: 12500, total: 123123123},
        			{item: "Jumbo", quantity: 50, unit: "Tray", price: 200, total: 10000}
        		]
        	 }
        ];
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.generateReport = this.generateReport.bind(this);
    }

    setStartDate(date){
		this.setState({
			startDate: date
		});
    }

    setEndDate(date){
    	this.setState({
    		endDate: date
    	});
    }

    generateReport(){
        const startDate = this.state.startDate ? this.state.startDate : "";
        const endDate = this.state.endDate ? this.state.endDate : "";
        let range = {
            startDate: startDate,
            endDate: endDate
        };
        axios.post('http://localhost:3001/report', range).then((res) => {
            console.log(res.data);
            this.setState({
                receipts: res.data
            });
        });
    	// this.setState({
    	// 	receipts: this.receipts
    	// });
        // var doc = new jsPDF();
        // doc.text("Hello World", 10, 10);
        // doc.save('a4.pdf');
    }
    
    render(){
    	const startDate = this.state.startDate;
    	const endDate = this.state.endDate;
    	const receipts = this.state.receipts.length ? this.state.receipts.map((rec) => {
    		return(
				rec.orders.map((ord, index) => {
					if(index === 0){
						return(
							<tr key={rec.customer+index}>
								<td rowSpan={rec.orders.length}>{rec.receiptID}</td>
			    				<td rowSpan={rec.orders.length}>{rec.customer}</td>
			    				<td>{rec.orders[0].item}</td>
								<td>{rec.orders[0].quantity}</td>
								<td>{rec.orders[0].unit}</td>
								<td>{rec.orders[0].price}</td>
								<td>{rec.orders[0].total}</td>
		    				</tr>
						)
					}else{
						return(
							<tr key={rec.customer+index}>
								<td>{ord.item}</td>
								<td>{ord.quantity}</td>
								<td>{ord.unit}</td>
								<td>{ord.price}</td>
								<td>{ord.total}</td>
							</tr>
						)
					}
					
				})
			)
    	}) : [];

        return(
            <div id="report" className="center-container">
            	<h2>Report</h2>
            	<div className="date-range">
            		From:
            		<DatePicker selected={startDate} onChange={this.setStartDate}/>
            	</div>
            	<div className="date-range">
            		To:
            		<DatePicker selected={endDate} onChange={this.setEndDate}/>
            	</div>
            	<button type="button" onClick={ () => this.generateReport()}>Generate</button>
            	<table>
            		<thead>
            			<tr>
            				<th></th>
            				<th>Customer</th>
            				<th>Item</th>
            				<th>Qty</th>
            				<th>Unit</th>
            				<th>Price per Unit</th>
            				<th>Total Price</th>
            			</tr>
            		</thead>
            		<tbody>
            			{receipts}
            		</tbody>
            	</table>
            </div>
        );
    }
}

export default Report