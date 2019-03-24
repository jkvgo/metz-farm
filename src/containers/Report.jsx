import React, {Component} from 'react';
import UserSession from '../UserSession';
import DatePicker from 'react-datepicker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf';
import axios from 'axios';
window.html2canvas = html2canvas;

import 'react-datepicker/dist/react-datepicker.css';

class Report extends Component{

    constructor(props){
        UserSession.redirectToLogin()
        super(props);
        this.state = {
        	startDate: new Date(),
        	endDate: new Date(),
        	receipts: [],
            hideButton: "",
            hideDownload: "hide",
            customers: [],
            chosenCustomer: "all"
        };
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.generateReport = this.generateReport.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.getCustomers();
    }

    getCustomers(){
        axios.get("basecustomers").then((res) => {
            this.setState({
                customers: res.data
            });
        });
    }

    chooseCustomer(e){
        const customer = e.target.value;
        this.setState({
            chosenCustomer: customer
        });
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
        this.setState({
            receipts: []
        });
        const startDate = this.state.startDate ? this.state.startDate : "";
        const endDate = this.state.endDate ? this.state.endDate : "";
        const chosenCustomer = this.state.chosenCustomer;
        let range = {
            customer: chosenCustomer,
            startDate: startDate,
            endDate: endDate
        };
        axios.post('report', range).then((res) => {
            if(res.data.length > 0){
                this.setState({
                    receipts: res.data,
                    hideDownload: ""
                });
            }
        });
    }

    downloadReport(){
        this.setState({
            hideButton: "hide"
        });
        const reportDiv = document.getElementById("report");
        html2canvas(reportDiv).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 20, 210, 0);
            pdf.save('report.pdf');
            this.setState({
                hideButton: ""
            });
        });
    }
    
    render(){
    	const startDate = this.state.startDate;
    	const endDate = this.state.endDate;
        const hideButton = this.state.hideButton;
        const hideDownload = this.state.hideDownload;
        const customers = this.state.customers.length ? this.state.customers.map((c, key) => {
            return (
                <option key={key} value={c.id}>{c.name}</option>
            )
        }) : [];
        const chosenCustomer = this.state.chosenCustomer;
        let grandTotal = 0;
        let hide = "hide";
        let reportGrandTotal = 0;
    	const receipts = this.state.receipts.length ? this.state.receipts.map((rec) => {
    		return(
				rec.orders.map((ord, index) => {
					if(index === 0){
                        grandTotal = rec.orders[0].total;
                        hide = "hide";
                        if(rec.orders.length === index+1){
                            hide = "";
                            reportGrandTotal += grandTotal;
                        }
						return(
							<tr key={rec.customer+index}>
								<td rowSpan={rec.orders.length} valign="top">{rec.receiptID}</td>
			    				<td rowSpan={rec.orders.length} valign="top">{rec.customer}</td>
			    				<td>{rec.orders[0].item}</td>
								<td>{rec.orders[0].quantity}</td>
								<td>{rec.orders[0].unit}</td>
								<td>{rec.orders[0].price}</td>
								<td>{rec.orders[0].total}</td>
                                <td className={hide}><b>{grandTotal}</b></td>
		    				</tr>
						)
					}else{
                        grandTotal += ord.total;
                        if(rec.orders.length === index+1){
                            hide = "";
                            reportGrandTotal += grandTotal;
                        }
						return(
							<tr key={rec.customer+index} className="no-border">
								<td>{ord.item}</td>
								<td>{ord.quantity}</td>
								<td>{ord.unit}</td>
								<td>{ord.price}</td>
								<td>{ord.total}</td>
                                <td className={hide}><b>{grandTotal}</b></td>
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
                    Customer:
                    <select onChange={(e) => this.chooseCustomer(e)}>
                        <option value="all">All</option>
                        {customers}
                    </select>
                </div>
            	<div className="date-range">
            		From:
            		<DatePicker selected={startDate} onChange={this.setStartDate}/>
            	</div>
            	<div className="date-range">
            		To:
            		<DatePicker selected={endDate} onChange={this.setEndDate}/>
            	</div>
            	<button className={hideButton} type="button" onClick={ () => this.generateReport()}>Generate</button>
            	<table>
            		<thead>
            			<tr>
            				<th>Order No.</th>
            				<th>Customer</th>
            				<th>Item</th>
            				<th>Qty</th>
            				<th>Unit</th>
            				<th>Price per Unit</th>
            				<th>Total Price</th>
                            <th>Grand Total</th>
            			</tr>
            		</thead>
            		<tbody>
            			{receipts}
            		</tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>Report Total:</b></td>
                            <td><b>{reportGrandTotal}</b></td>
                        </tr>
                    </tfoot>
            	</table>
                <button type="button" className={"download-button " + hideDownload} onClick={() => this.downloadReport()}>Download</button>
            </div>
        );
    }
}

export default Report