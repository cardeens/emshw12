INSERT INTO departments (name)
VALUES ("HR"), ("Engineering"), ("Sales"), ("Marketing"), ("IT");

SELECT * FROM departments;

INSERT INTO roles (title, salary, department_id)
VALUES ("HR Director", 80000, 1), ("Recruiter", 65000, 1), ("VP Engineering", 300000, 2), ("SDE", 150000, 2), ("QA Analyst", 120000, 2), ("Sales Manager", 175000, 3), ("Sales Intern", 30000, 3), ("Marketing Director", 200000, 4), ("IT Specialist", 100000, 5);

SELECT * FROM roles;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Helen", "Parinsky", 1, null), ("Rachel", "McAdams", 2, 1), ("Riley", "Reid", 2, 1), ("Billy", "DaNerd", 3, null), ("Billy", "Eilish", 4, 4), ("Fineis", "Eilish", 4, 4), ("Cheech", "Chong", 5, 4), ("Paul", "Galle", 6, null), ("Dat", "Boi", 7, 8), ("JJ", "Cardenas", 8, null), ("Kodak", "Black", 9, null), ("Kanye", "West", 9, null), ("Xing", "Bong", 4, 4);

SELECT * FROM employees;