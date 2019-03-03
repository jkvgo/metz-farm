const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

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

db.serialize(() => {
	db.each("SELECT * FROM users", (err, row) => {
		if (err) {
		  console.error(err.message);
		}
		console.log(row);
	});
	console.log("FINISHED");
});

// close the database connection
db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});

app.listen(port, '0.0.0.0', function(){
	console.log("Listening on: " + port);
});