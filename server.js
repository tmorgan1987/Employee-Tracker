// sets up basic requirements.
const mysql = require('mysql2')
const inquirer = require('inquirer');
const express = require('express');
require('dotenv').config();

const port = 3001;
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.listen(port);

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'employeeTracker_db'
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
	.then((answer ) => {
		const { selection } = answer;
		if (selection === 'View Employees') {
			seeEmployees();  //done
		} else if (selection === 'View Employee Roles') {
			seeRoles(); //done
		} else if (selection === 'View the Departments') {
			seeDepartments(); //done
		} else if (selection === 'Add an Employee') {
			addEmployee(); //done
		} else if (selection === 'Update an Employee') {
			updateEmployee(); //done
		} else if (selection === 'Add an Employee Role') {
			addEmployeeRole(); //done
		} else if (selection === 'Update an Employee') {
			updateEmployee(); //done
		} else if (selection === 'Add a Department') {
			addDepartment(); //done
		} else (selection === 'Quit'); {
			// connection.end();
		};
	});
};

// let's show some employed persons.
seeEmployees = () => {
	console.table('Showing employees!');
	const sql = `SELECT employee.id,
											employee.first_name,
											employee.last_name,
											role.title,
											department_name AS department_name,
											role.salary,
											CONCAT (manager.first_name, " ", manager.last_name) AS manager
											FROM employee
											LEFT JOIN role ON employee.role_id = role.id
											LEFT JOIN department ON role.department_id = department.id
											LEFT JOIN employee manager ON employee.manager_id = manager.id`;
connection.query(sql, (err, rows) => {
	if (err) throw err;
	console.table(rows);
	menu();
});
};

// let's see them roles
seeRoles = () => {
	console.log('Showing roles!');
	const sql = `SELECT role.id, role.title, department.department_name AS department
							FROM role
							INNER JOIN department ON role.department_id = department.id`;
connection.query(sql, (err, rows) => {
	if (err) throw err;
	console.table(rows);
	menu();
});
};

// view all departments
seeDepartments = () => {
		console.log('Showing departments!');
		const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
connection.query(sql, (err, rows) => {
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

	connection.query(roleSql, (err, data) => {
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

			connection.query(managerSql, (err, data) => {
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

// let's update an employee.
updateEmployee = () => {
	const employeeSql = `SELECT * FROM employee`;

	connection.query(employeeSql, (err, data) => {
		if (err) throw err;
		const employees = data.map(({ id, first_name, last_name}) => ({ name: first_name + " "+ last_name, value: id}));

		inquirer.prompt([
			{
				type: 'list',
				name: 'name',
				message: 'Which of the employees would you like to make updates to?',
				choices: employees
			}
		])
		.then(employeeChoice => {
			const employee = employeeChoice.name;
			const params = [];
			params.push(employee);

			const roleSql = `SELECT * FROM role`;

			connection.query(roleSql, async(err, data) => {
				if (err) throw err;
				const roles = data.map(({id, title}) => ({ name: title, value: id }));
				console.log(roles);
				await inquirer.prompt([
					{
						type: 'list',
						name: 'role',
						message: "What is the employee's new role?",
						choices: roles
					}
				])
				.then(chosenRole => {
					const role = chosenRole.role;
					params.push(role);

					let employee = params[0]
					params[0] = role
					params[1] = employee

					const sql = `UPDATE employee SET role_id = ? WHERE id = ?`

					connection.query(sql, params, (err, result) => {
						if (err) throw err;
						console.log("The employee has been successfully updated!");

					seeEmployees();

					});
				});
			});
			console.log("hello")
		});
	});
};

// let's add an employee role.
addEmployeeRole = () => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'role',
			message: "What role would you like to add?",
			validate: addEmployeeRole => {
				if (addEmployeeRole) {
					return true;
				} else {
					console.log('Please enter a new role for the employees.');
					return false;
				}
			}
		},
		{
		type: 'input',
		name: 'salary',
		message: 'What is the salary for this new role?',
		validate: addSalary => {
			if (!isNaN(addSalary)) {
				return true;
			} else {
				console.log('Please enter a salary for the role you are creating.');
				return false;
			}
		}
	}
])
	.then(answer => {
		const params = [answer.role, answer.salary];
		const roleSql = `SELECT department_name, id FROM department`;

		connection.query(roleSql, (err, data) => {
			if (err) throw err;
			const department = data.map(({ name, id}) => ({ name: name, value: id}));

			inquirer.prompt([
				{
					type: 'list',
					name: 'department',
					message: 'What department will this role be in?',
					choices: department
				}
			])
			.then(departmentChoice => {
				const department = departmentChoice.department;
				params.push(department);

				const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

				connection.query(sql, params, (err, result) => {
					if (err) throw err;
					console.log('Added' + answer.role + " to roles!");

					seeRoles();
				});
			});
		});
	});
};

//let's add departments
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDepartment',
      message: "What department would you like to create??",
      validate: addDepartment => {
        if (addDepartment) {
            return true;
        } else {
            console.log('Please enter a department.');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (department_name)
                  VALUES (?)`;
      connection.query(sql, answer.addDepartment, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDepartment + " to departments!"); 

        seeDepartments();
    });
  });
};
