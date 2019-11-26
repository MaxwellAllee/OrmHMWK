var express = require("express");

var PORT = process.env.PORT || 8000;
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//var routes = require("./controllers/burgersController.js");
//Mysql stuff

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "burgers_db"
});


connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
// express stuff

app.get("/", function (req, res) {
  res.redirect("/burgers");
});

app.get("/burgers", function (req, res) {

  var queryString = "SELECT * FROM burgers ;";
  connection.query(queryString, function (err, result) {
    if (err) {
      throw err;
    }
    res.render("index", { burger_data: result });
  });
});

// post route -> back to index
app.post("/burgers/create", function (req, res) {
  var queryString = "INSERT INTO burgers( burger_name , devoured) VALUES (?, ?) ";

  console.log(queryString);

  connection.query(queryString, [req.body.burger_name, 0], function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
    res.redirect("/");

  });
});

// put route -> back to index
app.put("/burgers/:id", function (req, res) {

  var queryString = "UPDATE burgers SET devoured = 1 WHERE id= ?;";


  console.log(queryString);
  connection.query(queryString, req.params.id, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);

    res.sendStatus(200);

  });


});



//app.use(routes);

app.listen(PORT, function () {
  console.log("Listening on port:%s", PORT);
});
