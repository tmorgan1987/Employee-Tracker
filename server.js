// sets up basic requirements.
const db = require('./db/connection'); 
const inquirer = require('inquirer');

//let's get a menu rolling.
const menu = () => {
	inquirer.prompt({ type: 'list', name: 'selection', message: 'What would you like to do?', choices: ['View Employees', 'View Employee Roles', 'View the Departments', 'Add an Employee', 'Update an Employee', 'Add an Employee Role', 'Add a Department', 'Quit'] })
	.then(({ selection }) => {
		if (selection === 'View Employees') {
			viewEmployees();
		} else if (selection === 'View Employee Roles') {
			viewRoles();
		} else if (selection === 'View the Departments') {
			viewDepartments();
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
		} else (selection === 'Quit') {
			process.exit();
		};
	});
};

menu();
