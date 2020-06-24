import React, {Component} from 'react';
import moment from 'moment';
import html2canvas from 'html2canvas';
import UserSession from '../UserSession';
import jsPDF from 'jspdf';
import axios from 'axios';
window.html2canvas = html2canvas;

class Details extends Component{
	constructor(props){
		UserSession.redirectToLogin()
		super(props);
		this.orderID = props.match.params.id ? props.match.params.id : 0;
		this.state = {
			details: [],
			orderID: "",
			customer: "",
			hideButton: ""
		};
		this.getOrderDetails = this.getOrderDetails.bind(this);
		this.downloadWord = this.downloadWord.bind(this);
		this.downloadReceipt = this.downloadReceipt.bind(this);
		this.printReceipt = this.printReceipt.bind(this);
		this.getOrderDetails();
	}

	getOrderDetails(){
		axios.get("http://localhost:3000/orders/"+this.orderID).then((res) => {
			this.setState({
				details: res.data,
				orderID: res.data[0].order_id,
				customer: res.data[0].name,
				date: res.data[0].created
			});
		});
	}

	downloadWord(){
        this.setState({
            hideButton: "hide"
        });

        var css = (
	     '<style>' +
	     '@page WordSection1{size: 595.35pt 841.95pt;mso-page-orientation: portrait;}' +
	     'div.WordSection1 {page: WordSection1;}' +
	     '</style>'
	   );

	   var html = document.getElementById("details").innerHTML;
	   var blob = new Blob(['\ufeff', css + html], {
	     type: 'application/msword'
	   });
	   var url = URL.createObjectURL(blob);
	   var link = document.createElement('A');
	   link.href = url;
	   link.download = 'Receipt';  // default name without extension 
	   document.body.appendChild(link);
	   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Receipt.doc'); // IE10-11
	       else link.click();  // other browsers
	   document.body.removeChild(link);

	   this.setState({
	   		hideButton: ""
	   });
    }

	downloadReceipt(){
		this.setState({
            hideButton: "hide"
        });
		const receiptDiv = document.getElementById("details");
		html2canvas(receiptDiv).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 20, 210, 0);
            pdf.save('receipt.pdf');
            this.setState({
                hideButton: ""
            });
		});
	}

	printReceipt(){
		this.setState({
			hideButton: "hide"
		});
		window.print();
		this.setState({
			hideButton: ""
		});
	}

	render(){
		const orderID = this.state.orderID;
		const customer = this.state.customer;
		const hideButton = this.state.hideButton;
		const orderDate = this.state.date;
		let localDate = moment(orderDate).add(8, 'hours').format('MM/DD/YYYY hh:mm A');
		let grandTotal = 0;
		const details = this.state.details.length ? this.state.details.map((det,key) => {
			grandTotal += det.price;
			return(
				<tr key={key}>
					<td>{det.item}</td>
					<td>{det.quantity}</td>
					<td>{det.unit}</td>
					<td>{parseFloat(det.unit_price.toFixed(2)).toLocaleString()}</td>
					<td>{parseFloat(det.price.toFixed(2)).toLocaleString()}</td>
				</tr>
			)
		}) : [];
		return(
			<div id="details">
				<div className="detail-header">
					<h2>Customer: <b>{customer}</b></h2>
					<h2>Order Number: <b>{orderID}</b></h2>
					<br/>
					<h3>Date: <b>{localDate}</b></h3>
				</div>
				<table>
					<thead>
						<tr>
							<th>Item</th>
							<th>Qty</th>
							<th>Unit</th>
							<th>Price per Unit</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{details}
					</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td style={{textAlign:"right"}}>Grand Total:</td>
							<td><b>{parseFloat(grandTotal.toFixed(2)).toLocaleString()}</b></td>
						</tr>
					</tfoot>
				</table>
				<button className={hideButton + " margin-left-10"} type="button" onClick={ () => this.printReceipt()}>Print</button>
				<button className={hideButton + " margin-left-10"} type="button" onClick={ () => this.downloadReceipt()}>Download</button>
				<button className={hideButton} type="button" onClick={ () => this.downloadWord()}>Download on Word</button>
			</div>
		)
	}
}

export default Details;