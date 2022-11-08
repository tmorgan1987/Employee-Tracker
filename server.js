// sets up basic requirements.
const mysql = require('mysql2')
const inquirer = require('inquirer');

require('dotenv').config();

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.MYSQL_PASSWORD,
	database: 'employee_db'
});

connection.connect(err => {
	if (err) throw err;
	console.log('Connected to the Employee Tracker Database!')
	menu();
});

//let's get a menu rolling.
const menu = () => {
	inquirer.prompt([{ type: 'list', 
										name: 'selection', 
										message: 'Welcome to the Employee Tracker.  What would you like to do?', 
										choices: ['View Employees', 
										'View Employee Roles', 
										'View the Departments', 
										'Add an Employee', 
										'Update an Employee', 
										'Add an Employee Role', 
										'Add a Department', 
										'Quit'] }])
	.then((selection ) => {
		const { choices } = selection;
		if (selection === 'View Employees') {
			seeEmployees();
		} else if (selection === 'View Employee Roles') {
			seeRoles();
		} else if (selection === 'View the Departments') {
			seeDepartments();
		} else if (selection === 'Add an Employee') {
			addEmployee();
		} else if (selection === 'Update an Employee') {
			updateEmployee();
		} else if (selection === 'Add an Employee Role') {
			addEmployeeRole();
		} else if (selection === 'View the Departments') {
			viewDepartments();
		} else if (selection === 'Add an Employee') {
			addEmployee();
		} else if (selection === 'Update an Employee') {
			updateEmployee();
		} else if (selection === 'Add an Employee Role') {
			addEmployeeRole();
		} else if (selection === 'Add a Department') {
			addDepartment();
		} else (selection === 'Quit'); {
			connection.end();
		};
	});
};

// let's show some employed persons.
seeEmployees = () => {
	console.log('Showing employees!');
	const sql = `SELECT employee.id,
											employee.first_name,
											employee.last_name,
											role.title,
											department.name AS department,
											role.salary,
											CONCAT (manager.first_name, " ", manager.last_name) AS manager
											FROM employee
											LEFT JOIN role ON employee.role_id = role.id
											LEFT JOIN department ON role.department_id = department.id
											LEFT JOIN employee manager ON employee.manager_id = manager.id`;
connection.promise().query(sql, (err, rows) => {
	if (err) throw err;
	console.table(rows);
	menu();
});
};

// let's see them roles
seeRoles = () => {
	console.log('Showing roles!');
	const sql = `SELECT role.id, role.title, department.name AS department
							FROM role
							INNER JOIN department ON role.department_id = department.id`;
connection.promise().query(sql, (err, rows) => {
	if (err) throw err;
	console.table(rows);
	menu();
});
};

// view all departments
seeDepartments = () => {
		console.log('Showing departments!');
		const sql = `SELECT department.id AS id, department.name AS department FROM department`;
connection.promise().query(sql, (err, rows) => {
	if (err) throw err;
	console.table(rows);
	menu();
});
};

//add employee
addEmployee = () => {
	inquirer.prompt([{
		type: 'input',
		name: 'firstName',
		message: 'What is the first name of the employee?',
		validate: addFirstName => {
			if (addFirstName) {
				return true;
			} else {
				console.log('Please enter the first name of the employee.');
				return false;
			}
		}
	},
{
		type: 'input',
		name: 'lastName',
		message: 'What is the last name of the employee?',
		validate: addLastName => {
			if (addLastName) {
				return true;
			} else {
				console.log('Please add the last name of the employeee.');
				return false;
			}
		}
}
])
.then(answer => {
	const params = [answer.firstName, answer.lastName]
	const roleSql = `SELECT role.id, role.title FROM role`;

	connection.promise().query(roleSql, (err, data) => {
		if (err) throw err;
		const roles = data.map(({ id, title }) => ({ name: title, value: id }));

		inquirer.prompt([
			{
				type: 'list',
				name: 'role',
				message: 'What is the role of the employee?',
				choices: roles
			}
		])
		.then(roleSelection => {
			const role = roleSelection.role;
			params.push(role);

			const managerSql = `SELECT * from employee`;

			connection.promise().query(managerSql, (err, data) => {
				if (err) throw err;
				const managers = data.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));
			
			inquirer.prompt([
				{
					type: 'list',
					name: 'manager',
					message: 'Who is the manager of the employee?',
					choices: managers
				}
			])
			.then(managerSelection => {
				const manager = managerSelection.manager;
				params.push(manager);
				const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
				connection.query(sql, params, (err, results) => {
					if (err) throw err;
					console.log("You've added an employee!")

					seeEmployees();
				});
			});
		});
	});
});
});
};
