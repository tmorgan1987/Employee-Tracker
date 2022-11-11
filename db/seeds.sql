INSERT INTO department (department_name)
VALUES 
('Human Resources'),
('Accounting'),
('Sales'),
('Information Technology');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 75000, 1),
('Software Engineer', 95000, 1),
('Accountant', 50000, 2), 
('Marketing Coordinator', 80000, 3), 
('Sales Lead', 85000, 3),
('Project Manager', 100000, 4),
('Operations Manager', 95000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Joseph', 'Anderson', 2, null),
('Christopher', 'Tavares', 1, 1),
('Hunter', 'Young', 4, null),
('Connor', 'Murphy', 3, 3),
('Charlee', 'Gordon', 6, null),
('Jason', 'Weibel', 5, 5),
('Ben', 'Taylor', 7, null),
('Diego', 'Mora', 7, 1);