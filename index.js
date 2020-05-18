var mysql = require("mysql");
var inquirer = require("inquirer")

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Crossfire10!",
    database: "employee_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


const start = () => {
    inquirer.
        prompt([
            {
                name: "start",
                message: "WHAT WOULD YOU LIKE TO DO?",
                type: "list",
                choices: [
                    "View data",
                    "Add data",
                    "Update data",
                    "Delete data",
                    "Quit"
                ]
            }
        ])
        .then((answers) => {
            switch (answers.start) {
                case "View data":
                    viewData(answers);
                    break;
                case "Add data":
                    addData(answers);
                    break;
                case "Update data":
                    updateData(answers);
                    break;
                case "Delete data":
                    deleteFields(answers);
                    break;
                case "Quit":
                    process.quit();

            }
        })
}

const viewData = (answers) => {
    inquirer.prompt([
        {
            name: "viewData",
            message: "What would you like to view?",
            type: "list",
            choices: [
                "Employee",
                "Role",
                "Employee"
            ]
        }
    ]).then((answers) => {
        switch (answers.viewData) {
            case "Employee":
                
        }
})
}

const addData = (answers) => {
    inquirer.prompt([
        {
            name: "addOptions",
            message: "What data are you adding?",
            type: "list",
            choices: [
                "Employee",
                "Role",
                "Department"
            ]
        },
    ]).then((answers) => {
        switch (answers.addOptions) {
            case "Employee":
                inquirer.prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "Add first name:"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "Add last name:"
                    }
                ]).then((answer) => {
                    const first = answer.firstName
                    const last = answer.lastName
                    connection.query("SELECT id, title FROM roles",
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            inquirer.prompt(
                                {
                                    name: "role",
                                    type: "number",
                                    message: "Enter role ID:"
                                }
                            ).then((answer) => {
                                const role = answer.role
                                connection.query("SELECT id, first_name, last_name FROM employees",
                                    function (err, res) {
                                        if (err) throw err;
                                        console.table(res);
                                        inquirer.prompt(
                                            {
                                                name: "manager",
                                                type: "number",
                                                message: "Enter ID of employee's manager:"
                                            }
                                        ).then((answer) => {
                                            connection.query("INSERT INTO employees SET ?",
                                                {
                                                    first_name: first,
                                                    last_name: last,
                                                    role_id: role,
                                                    manager_id: answer.manager
                                                },
                                                function (err, res) {
                                                    if (err) throw err;
                                                    connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id",
                                                        function (err, res) {
                                                            if (err) throw err;
                                                            console.table(res);
                                                            console.log("Employee added!")
                                                            start();
                                                        }
                                                    )
                                                }
                                            )
                                        });
                                    }
                                )
                            });

                        }
                    )
                });
                break;

            case "Role":
                inquirer.prompt([
                    {
                        name: "roleTitle",
                        type: "input",
                        message: "What role are you adding?",
                    },
                    {
                        name: "roleSalary",
                        type: "number",
                        message: "What is the salary for this role?",
                    }

                ]).then((answer) => {
                    const name = answer.roleTitle
                    const roleSalary = answer.roleSalary
                    connection.query("SELECT id, name FROM departments",
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            inquirer.prompt(
                                {
                                    name: "departmentID",
                                    type: "number",
                                    message: "Enter the department ID for this role:"
                                }
                            ).then((answer) => {
                                connection.query("INSERT INTO roles SET ?",
                                    {
                                        title: name,
                                        salary: roleSalary,
                                        department_id: answer.departmentID
                                    },
                                    function (err, res) {
                                        if (err) throw err;
                                        connection.query("SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments on roles.department_id = departments.id",
                                            function (err, res) {
                                                if (err) throw err;
                                                console.table(res);
                                                console.log("Role added!")
                                                start();

                                            });

                                    })
                            });
                        })
                })
                break;

            case "Department":
                inquirer.prompt([
                    {
                        name: "addDepartment",
                        type: "input",
                        message: "What department are you adding?",
                    }
                ]).then((answer) => {
                    connection.query("INSERT INTO departments SET ?",
                        { name: answer.addDepartment },
                        function (err, res) {
                            if (err) throw err;
                            connection.query("SELECT id, name FROM departments",
                                function (err, res) {
                                    if (err) throw err;
                                    start();
                                    console.log("Added department!")
                                })

                        })
                });
                break;




        };
    }
    )
};
