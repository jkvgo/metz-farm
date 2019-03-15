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

app.get("/history/:id", (req, res) => {
	let id = req.params.id;
	let results = [];
	let sql = `select ch.cust_id, c.name, i.item, i.unit, ch.price, ch.modified, ch.modified_by, u.name as 'modified_name' from customers c, customer_history ch, items i, users u where c.id = ch.cust_id and ch.item_id = i.id and ch.modified_by = u.id and ch.cust_id = ${id}`;
	db.serialize(() => {
		db.each(sql, (err, row) => {
			results.push(row);
		}, (err) => {
			res.status(err ? 500:200).json(err || results);
		});
	});
});

app.get("/customers/:id", (req, res) => {
	let id = req.params.id;
	let customerPrice = {}, results = [];
 	let sql = `select c.id, c.name, i.id as 'itemID', i.item, i.unit, cp.price, cp.modified, u.name as 'modified_name' from customers c, customer_price cp, items i, users u where c.id = cp.cust_id and cp.item_id = i.id and cp.modified = u.id and c.id = ${id}`;
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
	 					customerPrice.price[item.item][item.unit] = {price: item.price, id: item.itemID, modified: item.modified_name};
	 				}else{
	 					customerPrice.price[item.item] = {
	 						[item.unit]: {price: item.price, id: item.itemID, modified: item.modified_name}
	 					}
	 				}
	 			});
 			}
 			res.status(err ? 500:200).json(err || customerPrice);
 		});
 	});
});

app.get("/items", (req,res) => {
	let sql = `select id, item, unit from items`;
	let items = [];
	db.each(sql, (err,row) => {
		items.push(row);
	}, (err) => {
		res.status(err ? 500:200).json(err || items);
	})
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

app.post('/report', (req, res) => {
	const range = req.body;
	let orders = [], currOrder, mappedReceipts = [];
	let sql = `select o.id, c.name, o.created, i.id as 'item_id', i.item, i.unit, od.quantity, od.unit_price, od.price from orders o, order_details od, items i, customers c where o.cust_id = c.id and o.id = od.order_id and od.item_id = i.id and  o.created BETWEEN '${range.startDate}' AND '${range.endDate}' order by o.id`;
	db.serialize(() => {
		db.each(sql, (err, row) => {
			orders.push(row);
		}, (err) => {
			orders.forEach((ord) => {
				if(currOrder === ord.id){
					mappedReceipts.find(r => r.receiptID === ord.id).orders.push(
						{
							item: ord.item,
							quantity: ord.quantity,
							unit: ord.unit,
							price: ord.unit_price,
							total: ord.price
						}
					);
				}else{
					mappedReceipts.push({
						receiptID: ord.id,
						customer: ord.name,
						orders: [ {item: ord.item, quantity: ord.quantity, unit: ord.unit, price: ord.unit_price, total: ord.price} ]
					});
					currOrder = ord.id;
				}
			});
			res.status(err ? 500:200).json(err || mappedReceipts);
		});
	});
});

app.post("/customers", (req, res) => {
	const customer = req.body;
	let sql = `INSERT INTO customers(name,modified) VALUES(?,?)`;
	db.run(sql, [customer.name, customer.modified], function(err){
		if(err){
			return console.error(err.message);
			res.status(500).json(err);
		}
		console.log("Inserted Customers successfully");
		let customerID = this.lastID;
		let sqlPrice = `INSERT INTO customer_price(cust_id,item_id,price,modified) VALUES (?,?,?,?)`;
		db.run(sqlPrice, [customerID, 1, 0, customer.modified], function(err2){
			if(err2){
				return console.error("Error on inserting to customer_price table: " + err2.message);
				res.status(500).json(err);	
			}
			res.status(200).send();
			console.log("New customer default price inserted successfully");
		})
	})
});

app.post("/orders", (req, res) => {
	const orders = req.body;
	let filteredOrders;
	const customerID = orders[0].custID;
	const loggedIn = orders[0].loggedIn;
	let rowID;
	let sql = `INSERT INTO orders(cust_id,created_by) VALUES(?,?)`;
	// let bulkPlaceholders = orders.map((ord) => '(?)').join(',');
	let sqlBulk;
	db.run(sql, [customerID, loggedIn], function(err){
		if(err) res.status(500).json(err);
		rowID = this.lastID;
		let bulkPlaceholders = orders.map((ord) => {
			return `(${rowID},${ord.itemID},${ord.quantity},${ord.price},${ord.totalPrice})`
		});
		sqlBulk = `INSERT INTO order_details(order_id, item_id, quantity, unit_price, price) VALUES ` + bulkPlaceholders;
		db.run(sqlBulk, function(err2){
			if(err2) res.status(500).json(err);
			res.status(err ? 500:200).json(err || "Order submitted successfully");
		});
	})

	
});

app.post("/verify", (req,res) => {
	let verified = false;
	let credentials = req.body;
	let sql = `SELECT * FROM users WHERE name = ? AND password = ?`;
	db.serialize(() => {
		db.each(sql, [credentials.username, credentials.password], (err, row) => {
			res.status(err ? 500:200).json(err || row);
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
		console.log(`Customer price updated ${this.changes}`);

		// Update customer price history table after price-update
		let priceHistory = `(${customerPrice.customer}, ${customerPrice.item}, ${customerPrice.price}, ${customerPrice.loggedIn})`;
		let sqlBulk = `INSERT INTO customer_history(cust_id, item_id, price, modified_by) VALUES ` + priceHistory;
		db.run(sqlBulk, function(err2){
			if(err2){
				return console.error("Error on updating customer history: " + err2);
			}
			console.log(`Customer history inserted ${this.changes}`);
			res.status(200).send();
		});
	});
});

app.post("/addprice", (req,res) => {
	let newItem = req.body;
	let sql = `INSERT INTO customer_price(cust_id,item_id,price,modified) VALUES(?,?,?,?)`;
	db.run(sql, [newItem.cust_id, newItem.item_id, newItem.price, newItem.loggedIn], function(err){
		if(err){
			return console.error("Error on inserting to customer_price table: " + err.message);
			res.status(500).json(err);	
		}
		res.status(200).send();
		console.log("Added new customer price successfully");
	});
});

app.post("/item", (req, res) => {
	let newItem = req.body;
	let sql = `INSERT INTO items(item,unit,modified) VALUES(?,?,?)`;
	db.run(sql, [newItem.item, newItem.unit, newItem.loggedIn], function(err){
		if(err){
			return console.error("Error on inserting new item: " + err.message);
			res.status(500).json(err);
		}
		res.status(200).send();
		console.log("Added new item successfully");
	});
});

app.listen(port, '0.0.0.0', function(){
	console.log("Listening on: " + port);
});