const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
var path = require("path");

const port = 3001;
const app = express();
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(cors());

let db = new sqlite3.Database("./db/farm.db", sqlite3.OPEN_READWRITE, (err) => {
	if(err){
		return console.error("ERROR: " + err.message);
	}
	console.log("Good!");
});

// close the database connection
// db.close((err) => {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// 	console.log('Close the database connection.');
// });

app.get("/", (req,res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'), (err) => {
		if(err){
			res.status(500).send(err);
		}
	})
});

app.get("/customers/:id", (req, res) => {
	let id = req.params.id;
	let customerPrice = {}, results = [];
 	let sql = `select c.id, c.name, i.id as 'itemID', i.item, i.unit, cp.price, cp.modified from customers c, customer_price cp, items i where c.id = cp.cust_id and cp.item_id = i.id and c.id = ${id}`;
 	db.serialize(() => {
 		db.each(sql, (err, row) => {
 			results.push(row);
 		}, (err) => {
 			if(results){
 				customerPrice = {
	 				id: results[0].id,
	 				name: results[0].name,
	 				price: {}
	 			}
	 			results.forEach((item) => {
	 				if(customerPrice.price.hasOwnProperty(item.item)){
	 					customerPrice.price[item.item][item.unit] = {price: item.price, id: item.itemID, modified: item.modified};
	 				}else{
	 					customerPrice.price[item.item] = {
	 						[item.unit]: {price: item.price, id: item.itemID, modified: item.modified}
	 					}
	 				}
	 			});
 			}
 			res.status(err ? 500:200).json(err || customerPrice);
 		});
 	});
});

app.get("/customers", (req,res) => {
	let sql = `select c.id, c.name, i.id as 'itemID', i.item, i.unit, cp.price from customers c, customer_price cp, items i where c.id = cp.cust_id and cp.item_id = i.id order by c.id`;
	let customers = [], mappedCustomers;
	db.serialize(() => {
		db.each(sql, (err, row) => {
			customers.push(row);
		}, (err) => {
			let currCustomer;
			mappedCustomers = customers.reduce((allCust, cust) => {
				if(currCustomer !== cust.id){
					allCust.push({
						id: cust.id,
						name: cust.name,
						price: {
							[cust.item]: {
								[cust.unit]: { price: cust.price, id: cust.itemID }
							}
						}
					});
					currCustomer = cust.id;
				}else{
					if(allCust.find(c => c.id === cust.id).price.hasOwnProperty(cust.item)){
						allCust.find(c => c.id === cust.id).price[cust.item][cust.unit] = { price: cust.price, id: cust.itemID };
					}else{
						allCust.find(c => c.id === cust.id).price[cust.item] = {
							[cust.unit]: { price: cust.price, id: cust.itemID }
						};
					}
				}
				return allCust;
			}, []);
			res.status(err ? 500:200).json(err || mappedCustomers);
		});
	})
});

app.post("/orders", (req, res) => {
	const orders = req.body;
	let filteredOrders;
	const customerID = orders[0].custID;
	let rowID;
	let sql = `INSERT INTO orders(cust_id,created_by) VALUES(?,?)`;
	// let bulkPlaceholders = orders.map((ord) => '(?)').join(',');
	let sqlBulk;
	db.run(sql, [customerID, 1], function(err){
		if(err) return console.error(err.message);
		console.log("Inserted Order successfully");
		rowID = this.lastID;
		// console.log("HAS INSERTED BITCHEZ. ID is now: " + this.lastID);
		//  filteredOrders = orders.map((ord) => {
		// 	return {
		// 		order_id: rowID,
		// 		item_id: ord.itemID,
		// 		quantity: ord.quantity,
		// 		unit_orice: ord.price,
		// 		price: ord.totalPrice
		// 	}
		// });
		let bulkPlaceholders = orders.map((ord) => {
			return `(${rowID},${ord.itemID},${ord.quantity},${ord.price},${ord.totalPrice})`
		});
		sqlBulk = `INSERT INTO order_details(order_id, item_id, quantity, unit_price, price) VALUES ` + bulkPlaceholders;
		db.run(sqlBulk, function(err){
			if(err) return console.error("Error on bulk: " + err);
			console.log(`Rows inserted ${this.changes}`);
		});
	})

	
});

app.post("/verify", (req,res) => {
	let verified = false;
	let credentials = req.body;
	let sql = `SELECT * FROM users WHERE name = ? AND password = ?`;
	db.serialize(() => {
		db.each(sql, [credentials.username, credentials.password], (err, row) => {
			if (err) {
			  console.error(err.message);
			}
			verified = true;
		}, () => {
			if(verified){
				res.status(200).send();
			}else{
				res.status(500).send();
			}
		});

	});
});

app.post("/price", (req,res) => {
	let customerPrice = req.body;
	let sql = `UPDATE customer_price SET price = ${customerPrice.price} WHERE cust_id = ${customerPrice.customer} AND item_id = ${customerPrice.item}`;
	db.run(sql, function(err){
		if(err){
			return console.error("Error on updating customer price: " + err);
			res.status(500).send();
		}
		res.status(200).send();
		console.log(`Customer price updated ${this.changes}`);

		// Update customer price history table after price-update
		let priceHistory = `(${customerPrice.customer}, ${customerPrice.item}, ${customerPrice.price}, ${customerPrice.loggedIn})`;
		let sqlBulk = `INSERT INTO customer_history(cust_id, item_id, price, modified_by) VALUES ` + priceHistory;
		db.run(sqlBulk, function(err2){
			if(err2) return console.error("Error on updating customer history: " + err2);
			console.log(`Customer history inserted ${this.changes}`);
		});
	});
});

app.listen(port, '0.0.0.0', function(){
	console.log("Listening on: " + port);
});