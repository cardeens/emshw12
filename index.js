var mysql = require("mysql");

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
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});



const start = () => {
  inquirer.
      prompt(startPrompts)
      .then((answers) => {
          switch (answers.begin) {
              case "ADD":
                  createFields(answers);
                  break;
              case "VIEW":
                  readFields(answers);
                  break;
              case "UPDATE":
                  updateFields(answers);
                  break;
              case "DELETE":
                  deleteFields(answers);
                  break;
              case "QUIT":
                  process.exit();

          }
      })
}

const startPrompts = [
  {
      name: "begin",
      message: "WHAT WOULD YOU LIKE TO DO?",
      type: "list",
      choices: [
          "ADD",
          "VIEW",
          "UPDATE",
          "DELETE",
          "QUIT"
      ]
  },
  {
      name: "create_options",
      message: "WHAT WOULD YOU LIKE TO ADD?",
      type: "list",
      when: (answers) => answers.begin === "ADD",
      choices: [
          "DEPARTMENT",
          "ROLE",
          "EMPLOYEE"
      ]
  },
  {
      name: "read_options",
      message: "WHAT WOULD YOU LIKE TO VIEW?",
      type: "list",
      when: (answers) => answers.begin === "VIEW",
      choices: [
          "DEPARTMENTS",
          "ROLES",
          "EMPLOYEES",
          "EMPLOYEES BY MANAGER"
      ]
  },
  {
      name: "update_options",
      message: "WHAT WOULD YOU LIKE TO UPDATE?",
      type: "list",
      when: (answers) => answers.begin === "UPDATE",
      choices: [
          "EMPLOYEE ROLE",
          "EMPLOYEE MANAGER"
      ]
  },
  {
      name: "delete_options",
      message: "WHAT WOULD YOU LIKE TO DELETE?",
      type: "list",
      when: (answers) => answers.begin === "DELETE",
      choices: [
          "DEPARTMENT",
          "ROLE",
          "EMPLOYEE"
      ]
  }
]

const createDeptQ = [
  {
      name: "add_dept",
      type: "input",
      message: "WHAT IS THE NAME OF THE DEPARTMENT?",
  }];
const createRoleQ = [
  {
      name: "add_role",
      type: "input",
      message: "WHAT IS THE NAME OF THE ROLE?",
  }];

const createFields = (answers) => {
  switch (answers.create_options) {
      case "DEPARTMENT":
          inquirer.prompt(createDeptQ).then((answer) => {
              const add_dept = answer.add_dept;
              connection.query("INSERT INTO department SET ?",
                  { name: add_dept },
                  function (err, res) {
                      if (err) throw err;
                      connection.query("SELECT id, name FROM department",
                          function (err, res) {
                              if (err) throw err;
                              start();
                          })

                  })
          });
          break;

      case "ROLE":
          inquirer.prompt(createRoleQ).then((answer) => {
              const add_role = answer.add_role;
              connection.query("INSERT INTO role SET ?",
                  { title: add_role },
                  function (err, res) {
                      if (err) throw err;
                      connection.query("SELECT id, title FROM role",
                          function (err, res) {
                              if (err) throw err;
                              start();
                          });

                  })
          });
          break;

      case "EMPLOYEE":
          inquirer.prompt([
              {
                  name: "firstname",
                  type: "input",
                  message: "WHAT IS THE FIRST NAME OF THE EMPLOYEE?"
              },
              {
                  name: "lastname",
                  type: "input",
                  message: "LAST NAME?"
              }
          ]).then((answer) => {
              const firstname = answer.firstname;
              const lastname = answer.lastname
              connection.query("SELECT id, title FROM role",
                  function (err, res) {
                      if (err) throw err;
                      console.table(res);
                      inquirer.prompt(
                          {
                              name: "roleid",
                              type: "number",
                              message: "WHAT WILL THEIR ROLE BE? **SELECT BY ID**"
                          }
                      ).then((answer) => {
                          const roleid = answer.roleid;
                          connection.query("SELECT id, name FROM manager",
                              function (err, res) {
                                  if (err) throw err;
                                  console.table(res);
                                  inquirer.prompt(
                                      {
                                          name: "managerid",
                                          type: "number",
                                          message: "WHO IS THEIR MANAGER? **SELECT BY ID**"
                                      }
                                  ).then((answer) => {
                                      const managerid = answer.managerid
                                      connection.query("INSERT INTO employee SET ?",
                                          {
                                              first_name: firstname,
                                              last_name: lastname,
                                              role_id: roleid,
                                              manager_id: managerid
                                          },
                                          function (err, res) {
                                              if (err) throw err;
                                              connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id",
                                                  function (err, res) {
                                                      if (err) throw err;
                                                      console.table(res);
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
  };
};

const readFields = (answers) => {
  switch (answers.read_options) {
      case "DEPARTMENTS":
          connection.query("SELECT id, name FROM department",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  start();
              });
          break;

      case "ROLES":
          connection.query("SELECT id, title, salary, department_id FROM role",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  start();
              });
          break;

      case "EMPLOYEES":
          connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  start();
              });

          break;
      case "EMPLOYEES BY MANAGER":
          connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.department_id FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title = 'Manager'",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "which_manager",
                          message: "WHICH MANAGER'S EMPLOYEES WOULD YO LIKE TO SEE? **SELECT BY ID**",
                          type: "number"
                      }
                  ).then((answer) => {
                      const whichManager = answer.which_manager;
                      connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id=role.id WHERE employee.manager_id = ?",
                          [whichManager],
                          function (err, res) {
                              if (err) throw err;
                              console.table(res);
                              start();
                          });
                  })
              })
          break;
  }
};

const updateFields = (answers) => {
  switch (answers.update_options) {
      case "EMPLOYEE ROLE":
          connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "update_id",
                          message: "PLEASE SELECT WHICH EMPLOYEE YOU'D LIKE TO UPDATE. **SELECT BY ID**",
                          type: "number"
                      }).then((answer) => {
                          const selection = answer.update_id;
                          connection.query("SELECT id, title FROM role",
                      
                              function (err, res) {
                                  if (err) throw err;
                                  console.table(res);
                                  inquirer.prompt(
                                      {
                                          name: "update_selections",
                                          message: "WHAT WOULD YOU LIKE THE EMPLOYEE'S NEW ROLE ID TO BE? **SELECT BY ID**",
                                          type: "number"
                                      }
                                  ).then((answer) => {
                                      const roleid = answer.update_selections;

                                      connection.query("UPDATE employee SET ? WHERE ?",
                                          [{ role_id: roleid }, { id: selection }],
                                          function (err, res) {
                                              if (err) throw err;
                                              connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE ?",
                                                  { id: selection },
                                                  function (err, res) {
                                                      if (err) throw err;
                                                      console.log("UPDATED!");
                                                      console.table(res);
                                                      start();

                                                  })
                                          })
                                  })
                              })
                      })

              });
          break;
      case "EMPLOYEE MANAGER":
          connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.department_id FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title <> 'Manager'",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "update_id",
                          message: "PLEASE SELECT WHICH EMPLOYEE YOU'D LIKE TO UPDATE. **SELECT BY ID**",
                          type: "number"
                      }).then((answer) => {
                          const selection = answer.update_id;
                          connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.department_id FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title = 'Manager'",
                              function (err, res) {
                                  if (err) throw err;
                                  console.table(res);
                                  inquirer.prompt(
                                      {
                                          name: "update_selections",
                                          message: "WHO WOULD YOU LIKE THE EMPLOYEE'S NEW MANAGER TO BE? **SELECT BY ID**",
                                          type: "number"
                                      }
                                  ).then((answer) => {
                                      const managerid = answer.update_selections;

                                      connection.query("UPDATE employee SET ? WHERE ?",
                                          [{ manager_id: managerid }, { id: selection }],
                                          function (err, res) {
                                              if (err) throw err;
                                              connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE ?",
                                                  { id: selection },
                                                  function (err, res) {
                                                      if (err) throw err;
                                                      console.log("UPDATED!");
                                                      console.table(res);
                                                      start();

                                                  })
                                          })
                                  })
                              })
                      })

              });
          break;
  }
};

const deleteFields = (answers) => {
  switch (answers.delete_options) {
      case "DEPARTMENT":
          connection.query("SELECT id, name FROM department",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "which_dept",
                          message: "WHICH DEMPARTMENT WOULD YOU LIKE TO DELETE? **SELECT BY ID**",
                          type: "number"
                      }
                  ).then((answer) => {
                      const whichDept = answer.which_dept;
                      connection.query("DELETE FROM department WHERE ?",
                          { id: whichDept },
                          function (err, res) {
                              if (err) throw err;
                              connection.query("SELECT id, name FROM department",
                                  function (err, res) {
                                      console.table(res);
                                      console.log("DELETED!");
                                      start();
                                  })
                          })
                  })
              }
          )
      case "ROLE":
          connection.query("SELECT id, title FROM role",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "which_role",
                          message: "WHICH ROLE WOULD YOU LIKE TO DELETE? **SELECT BY ID**",
                          type: "number"
                      }
                  ).then((answer) => {
                      const whichRole = answer.which_role;
                      connection.query("DELETE FROM role WHERE ?",
                          { id: whichRole },
                          function (err, res) {
                              if (err) throw err;
                              connection.query("SELECT id, title FROM role",
                                  function (err, res) {
                                      console.log("DELETED!");
                                      console.table(res);
                                      start();
                                  })
                          })
                  })
              }
          )
      case "EMPLOYEE":
          connection.query("SELECT id, first_name, last_name FROM employee",
              function (err, res) {
                  if (err) throw err;
                  console.table(res);
                  inquirer.prompt(
                      {
                          name: "which_emp",
                          message: "WHICH EMPLOYEE WOULD YOU LIKE TO DELETE? **SELECT BY ID**",
                          type: "number"
                      }
                  ).then((answer) => {
                      const whichEmp = answer.which_emp;
                      connection.query("DELETE FROM role WHERE ?",
                          { id: whichEmp },
                          function (err, res) {
                              if (err) throw err;
                              connection.query("SELECT id, first_name, last_name FROM role",
                                  function (err, res) {
                                      console.log("DELETED!");
                                      console.table(res);
                                      start();
                                  })
                          })
                  })
              }
          )

  }
};