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
        const pdf = new jsPDF('l');

        html2canvas(reportDiv).then((canvas) => {
            for (var i = 0; i <= reportDiv.clientHeight/980; i++) {
                //! This is all just html2canvas stuff
                var srcImg  = canvas;
                var sX      = 0;
                var sY      = 876*i; // start 980 pixels down for every new page
                var sWidth  = 1200;
                var sHeight = 876;
                var dX      = 0;
                var dY      = 0;
                var dWidth  = 1178;
                var dHeight = 876;

                window.onePageCanvas = document.createElement("canvas");
                onePageCanvas.setAttribute('width', 1198);
                onePageCanvas.setAttribute('height', 876);
                var ctx = onePageCanvas.getContext('2d');
                // details on this usage of this function: 
                // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

                // document.body.appendChild(canvas);
                var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                var width         = onePageCanvas.width;
                var height        = onePageCanvas.clientHeight;

                //! If we're on anything other than the first page,
                // add another page
                if (i > 0) {
                    // pdf.addPage(595, 842); //8.5" x 11" in pts (in*72)
                    // pdf.addPage(842, 595);
                    pdf.addPage('l');
                }
                //! now we declare that we're working on that page
                pdf.setPage(i+1);
                //! now we add content to that page!
                pdf.addImage(canvasDataURL, 'PNG', 10, 15, 240, 0);

            }

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
        let grandTotal = 0, grandTotalText = "";
        let hide = "hide";
        let reportGrandTotal = 0;
    	const receipts = this.state.receipts.length ? this.state.receipts.map((rec) => {
    		return(
				rec.orders.map((ord, index) => {
                    let totalText = "";
					if(index === 0){
                        if(rec.orders[0].total === "Cancelled"){
                            grandTotal = 0;
                            totalText = "Cancelled";
                            grandTotalText = "Cancelled";
                        }else{
                            grandTotal = rec.orders[0].total;
                            totalText = parseFloat(rec.orders[0].total.toFixed(2)).toLocaleString();
                            grandTotalText = parseFloat(grandTotal.toFixed(2)).toLocaleString();
                        }
                        hide = "hide";
                        if(rec.orders.length === index+1){
                            hide = "";
                            reportGrandTotal += grandTotal;
                        }
						return(
							<tr key={rec.customer+index}>
                                <td className="td-minimum-width" rowSpan={rec.orders.length} valign="top">{rec.created}</td>
								<td rowSpan={rec.orders.length} valign="top" className="right-text padding-right-30">{rec.receiptID}</td>
			    				<td rowSpan={rec.orders.length} valign="top">{rec.customer}</td>
			    				<td>{rec.orders[0].item}</td>
								<td className="right-text padding-right-20">{rec.orders[0].quantity}</td>
								<td>{rec.orders[0].unit}</td>
								<td className="right-text" >{parseFloat(rec.orders[0].price.toFixed(2)).toLocaleString()}</td>
								<td className="right-text">{totalText}</td>
                                <td className={hide + " right-text"}><b>{grandTotalText}</b></td>
		    				</tr>
						)
					}else{
                        if(ord.total !== "Cancelled") grandTotal += ord.total;
                        if(rec.orders.length === index+1){
                            hide = "";
                            reportGrandTotal += grandTotal;
                        }
                        if(ord.total === "Cancelled"){
                            totalText = "Cancelled";
                            grandTotalText = "Cancelled";
                        }else{
                            totalText = parseFloat(rec.orders[0].total.toFixed(2)).toLocaleString();
                            grandTotalText = parseFloat(grandTotal.toFixed(2)).toLocaleString();
                        }
						return(
							<tr key={rec.customer+index} className="no-border">
								<td>{ord.item}</td>
								<td className="right-text padding-right-20">{ord.quantity}</td>
								<td>{ord.unit}</td>
								<td className="right-text">{parseFloat(ord.price.toFixed(2)).toLocaleString()}</td>
								<td className="right-text">{totalText}</td>
                                <td className={hide + " right-text"}><b>{grandTotalText}</b></td>
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
                            <th className="td-minimum-width">Date</th>
            				<th className="right-text padding-right-30">Order No.</th>
            				<th>Customer</th>
            				<th>Item</th>
            				<th className="right-text padding-right-20">Qty</th>
            				<th>Unit</th>
            				<th className="right-text">Price per Unit</th>
            				<th className="right-text">Total Price</th>
                            <th className="right-text">Grand Total</th>
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
                            <td></td>
                            <td><b>Report Total:</b></td>
                            <td className="right-text"><b>{parseFloat(reportGrandTotal.toFixed(2)).toLocaleString()}</b></td>
                        </tr>
                    </tfoot>
            	</table>
                <button type="button" className={"download-button " + hideDownload} onClick={() => this.downloadReport()}>Download</button>
            </div>
        );
    }
}

export default Report