const mySQL = require('mysql2');

const db = mySQL.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'employeeTracker_db'
	},
	console.log('Connected to the Employee Tracker Database!')
);

module.exports = db;