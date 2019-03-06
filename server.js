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

app.get("/customers", (req,res) => {
	let sql = `select c.id, c.name, i.item, i.unit, cp.price from customers c, customer_price cp, items i where c.id = cp.cust_id and cp.item_id = i.id order by c.id`;
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
								[cust.unit]: cust.price
							}
						}
					});
					currCustomer = cust.id;
				}else{
					if(allCust.find(c => c.id === cust.id).price.hasOwnProperty(cust.item)){
						allCust.find(c => c.id === cust.id).price[cust.item][cust.unit] = cust.price;
					}else{
						allCust.find(c => c.id === cust.id).price[cust.item] = {
							[cust.unit]: cust.price
						};
					}
				}
				return allCust;
			}, []);
			res.status(err ? 500:200).json(err || mappedCustomers);
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



app.listen(port, '0.0.0.0', function(){
	console.log("Listening on: " + port);
});