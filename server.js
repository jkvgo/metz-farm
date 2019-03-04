const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
var path = require("path");

const port = 3000;
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

app.get("/*", (req,res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'), (err) => {
		if(err){
			res.status(500).send(err);
		}
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