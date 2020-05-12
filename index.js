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

function start() {
  inquirer
    .prompt({
      name: "starterAction",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add data", "View data", "Update a role"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.starterAction === "View data") {
        viewAll();
      }
      else if(answer.postOrBid === "BID") {
        bidAuction();
      } else{
        connection.end();
      }
    });
}


function viewAll() {
  const query = "SELECT first_name, last_name, roles.title, roles.salary, departments.name FROM employees INNER JOIN roles ON (employees.role_id = roles.id) INNER JOIN departments ON (roles.department_id = departments.id);"

  connection.query(query, function(err,res){
    if (err) throw err;
    console.table(res);
  })
  
}