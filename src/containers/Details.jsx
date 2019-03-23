import React, {Component} from 'react';
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
		this.getOrderDetails();
	}

	getOrderDetails(){
		axios.get("orders/"+this.orderID).then((res) => {
			this.setState({
				details: res.data,
				orderID: res.data[0].order_id,
				customer: res.data[0].name
			});
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
            pdf.addImage(imgData, 'PNG', 10, 20, 210, 0);
            pdf.save('receipt.pdf');
            this.setState({
                hideButton: ""
            });
		});
	}

	render(){
		const orderID = this.state.orderID;
		const customer = this.state.customer;
		const hideButton = this.state.hideButton;
		let grandTotal = 0;
		const details = this.state.details.length ? this.state.details.map((det,key) => {
			grandTotal += det.price;
			return(
				<tr key={key}>
					<td>{det.item}</td>
					<td>{det.quantity}</td>
					<td>{det.unit}</td>
					<td>{det.unit_price}</td>
					<td>{det.price}</td>
				</tr>
			)
		}) : [];
		return(
			<div id="details">
				<div className="detail-header">
					<h2>Order Number: <b>{orderID}</b></h2>
					<h2>Customer: <b>{customer}</b></h2>
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
							<td><b>{grandTotal}</b></td>
						</tr>
					</tfoot>
				</table>
				<button className={hideButton} type="button" onClick={ () => this.downloadReceipt()}>Download</button>
			</div>
		)
	}
}

export default Details;