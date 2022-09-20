let express = require('express');
let cors = require('cors');
//const url = require('url');
//const querystring = require('querystring');

let fs = require("fs");
let app = express();

app.use(cors());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());
///////////////////////////////////////////////////////////////////////
//   API CALLS 

app.get('/api/todos', function (req, res) {
    console.log("Got a GET request for all todos");
    let data = fs.readFileSync( __dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    console.log( "Returned data is: ");
    console.log(data);
    res.end( JSON.stringify(data) );
});

app.get('/api/todos/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for todo #" + id);
    let data = fs.readFileSync( __dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    let match = data.find(t => t.id == id);
    console.log( "Returned data is: " );
    console.log(match);
    res.end( JSON.stringify(match) );
});

app.get('/api/todos/byuser/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for todos for userid " + id);
    let data = fs.readFileSync( __dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    let matching = data.filter(t => t.userid == id);
    console.log( "Returned data is: " );
    console.log(matching);
    res.end( JSON.stringify(matching) );
});

app.get('/api/categories', function (req, res) {
    console.log("Got a GET request for all categories");
    let data = fs.readFileSync( __dirname + "/data/" + "categories.json", 'utf8');
    data = JSON.parse(data);
    console.log( "Returned data is: ");
	console.log(data);
    res.end( JSON.stringify(data) );
});

app.get('/api/users', function (req, res) {
    console.log("Got a GET request for all users");
    let data = fs.readFileSync( __dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);

    let usersWithoutPasswords = [];
    for(let i = 0; i < data.length; i++)
    {
        let aUser = {id: data[i].id, name: data[i].name, username: data[i].username};
        usersWithoutPasswords.push(aUser);
    }

    console.log( "Returned all users (without passwords): ");
    console.log(usersWithoutPasswords);
    res.end( JSON.stringify(usersWithoutPasswords) );
});

app.get('/api/username_available/:username', function (req, res) {
    let username = req.params.username;
    console.log("Checking to see if username " + username + " is available");
    let data = fs.readFileSync( __dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);

    let matchingUser = data.find(u => u.username.toLowerCase() == username.toLowerCase());
    let message;
    if (matchingUser != null)
    {
        message = "NO";
    } 
    else
    {
        message = "YES";
    }
	
    console.log( "Returned message is: " );
    console.log(message);
    res.end( message );
});

app.get('/api/users/:username', function (req, res) {
    let username = req.params.username;
    console.log("Got a GET request for user with username " + username);
    let data = fs.readFileSync( __dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);
    let match = data.find(u => u.username.toLowerCase() == username.toLowerCase());
    console.log( "Returned user is: " );
    console.log(match);
    res.end( JSON.stringify(match) );
});

app.post('/api/todos', urlencodedParser, function (req, res) {
    console.log("Got a POST request to add a todo");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync( __dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse( data );

    let item = {
        id: data.length + 1,
        userid: req.body.userid,        
        category: req.body.category,
        description: req.body.description,
        deadline: req.body.deadline,
        priority: req.body.priority,
        completed: false
    };
    console.log( "New todo: " );
    console.log(item);

    data.push(item);

    fs.writeFileSync(__dirname + "/data/" + "todos.json", JSON.stringify(data));
   
    console.log( "New todo saved!" );
    res.status(200).send();
 });

 app.post('/api/users', urlencodedParser, function (req, res) {
    console.log("Got a POST request to add a user");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync( __dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse( data );

    // check for duplicate username
    let matchingUser = data.find(u => u.username.toLowerCase() == req.body.username.toLowerCase());
    if (matchingUser != null)
    {
        // username already exists
        console.log('ERROR: username already exists!');
        res.status(403).send();   // forbidden
        return;        
    }

    let user = {
        id: data.length + 1,      
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };
	
    console.log( "New user: " );
    console.log(user);

    data.push(user);

    fs.writeFileSync(__dirname + "/data/" + "users.json", JSON.stringify(data));
   
    console.log( "New user saved!" );
    res.status(200).send();
 });

 /*
 app.put('/api/todos', function (req, res) {
    console.log("Got a PUT request for ToDos");
    res.send('ToDos PUT');
 })
 
 app.delete('/api/todos', function (req, res) {
    console.log("Got a DELETE request for ToDos");
    res.send('ToDos DELETE');
 })
 */
 
app.use(express.static('public'));

let server = app.listen(8081, function () {
   let port = server.address().port; 
   console.log("App listening at port %s", port);
});
