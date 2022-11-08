DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE department(
	id INT PRIMARY KEY AUTO_INCREMENT,
	department_name VARCHAR(50)
);

CREATE TABLE role(
	id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(50)
	salary DECIMAL(9, 2)
	dept_id INT, FOREIGN KEY (dept_id) REFERENCES department(id)
)
-- Maybe add a delete function later.

CREATE TABLE employee(
	id INT PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(20),
	last_name VARCHAR(20),
	role_id INT,
	manager_id INT REFERENCES employee(id),
	FOREIGN KEY (role_id) REFERENCES role(id)
);
-- maybe add delete function

source db/seeds.sql;