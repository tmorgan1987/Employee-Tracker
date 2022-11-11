DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE department(
	id INT PRIMARY KEY AUTO_INCREMENT,
	department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
	id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INT, 
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER, 
 		FOREIGN KEY (role_id) REFERENCES role(id),
    manager_id INTEGER,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);