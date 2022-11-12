let express = require("express");
let cors = require("cors");
let fs = require("fs");

let app = express();
app.use(cors());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());

///////////////////////////////////////////////////////////////////////
//   API ENDPOINTS 

// Get all categories 
app.get("/api/categories", function (req, res) {
    console.log("LOG: Got a GET request for all categories");

    let data = fs.readFileSync(__dirname + "/data/" + "categories.json", "utf8");
    data = JSON.parse(data);

    // LOG data for tracing
    console.log("LOG: Returned categories are -> ");
    console.log(data);

    res.end(JSON.stringify(data));
});

// Get all TODOs
app.get("/api/todos", function (req, res) {
    console.log("LOG: Got a GET request for all todos");

    // Read todos.json  
    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", "utf8");
    data = JSON.parse(data);

    // LOG data for tracing
    console.log("LOG: Returned todos are -> ");
    console.log(data);

    res.end(JSON.stringify(data));
});

// Get one TODOs by id
app.get("/api/todos/:id", function (req, res) {
    let id = req.params.id;
    console.log("LOG: Got a GET request for todo " + id);

    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", "utf8");
    data = JSON.parse(data);

    // Find the requested todo
    let match = data.find(t => t.id == id);

    // If todo not found
    if (match == undefined) {
        console.log("LOG: **NOT FOUND**: todo " + id + " does not exist!");
        res.status(404).send();   // not found
        return;
    }

    // LOG data for tracing
    console.log("LOG: Returned todo is -> ");
    console.log(match);

    res.end(JSON.stringify(match));
});

// Get all TODOs for for a given user id
app.get("/api/todos/byuser/:id", function (req, res) {
    let id = req.params.id;
    console.log("LOG: Got a GET request for todos for userid " + id);

    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", "utf8");
    data = JSON.parse(data);

    // Find the requested todos
    let matching = data.filter(t => t.userid == id);

    // LOG data for tracing
    console.log("LOG: Returned todos are -> ");
    console.log(matching);

    res.end(JSON.stringify(matching));
});

// Get all users (without passwords)
app.get("/api/users", function (req, res) {
    console.log("LOG: Got a GET request for all users");

    let data = fs.readFileSync(__dirname + "/data/" + "users.json", "utf8");
    data = JSON.parse(data);

    // Copy users to an new array -- omiting the passwords
    let usersWithoutPasswords = [];
    for (let i = 0; i < data.length; i++) {
        let aUser = { id: data[i].id, name: data[i].name, username: data[i].username };
        usersWithoutPasswords.push(aUser);
    }

    // LOG data for tracing
    console.log("LOG: Returned users (without passwords) are -> ");
    console.log(usersWithoutPasswords);

    res.end(JSON.stringify(usersWithoutPasswords));
});

// Find out if a specific username is available
app.get("/api/username_available/:username", function (req, res) {
    let username = req.params.username;
    console.log("LOG: Checking to see if username " + username + " is available");

    let data = fs.readFileSync(__dirname + "/data/" + "users.json", "utf8");
    data = JSON.parse(data);

    // See if username already exists
    let matchingUser = data.find(u => u.username.toLowerCase() == username.toLowerCase());

    // Build JSON response w/ "available" property (assuming NOT available)
    let json = { available: "NO" };

    // If username not found, change "available" to "YES"
    if (matchingUser == null) {
        json.available = "YES";
    }

    // LOG response for tracing
    console.log("LOG: Returned message -> ");
    console.log(json);

    res.end(JSON.stringify(json));
});

// GET a specific user  
// note: this returns the user without the password
app.get("/api/users/:username", function (req, res) {
    let username = req.params.username;
    console.log("LOG: Got a GET request for user with username " + username);

    let data = fs.readFileSync(__dirname + "/data/" + "users.json", "utf8");
    data = JSON.parse(data);

    // Find the user
    let match = data.find(u => u.username.toLowerCase() == username.toLowerCase());

    // If user not found
    if (match == undefined) {
        console.log("LOG: **NOT FOUND**: user " + username + " does not exist!");
        res.status(404).send();   // not found
        return;
    }

    // Create a copy without the password
    let matchWithoutPassword = { id: match.id, name: match.name, username: match.username };

    // LOG data for tracing
    console.log("LOG: Returned user is -> ");
    console.log(matchWithoutPassword);

    res.end(JSON.stringify(matchWithoutPassword));
});

// POST a new todo
app.post("/api/todos", urlencodedParser, function (req, res) {
    console.log("LOG: Got a POST request to add a todo");
    console.log("LOG: Message body ->");
    console.log(JSON.stringify(req.body));

    // If not all todo data passed, requect the request
    if (req.body.userid || req.body.category || req.body.description ||
        req.body.deadline || req.body.priority) {

        console.log("LOG: **MISSING DATA**: one or more todo properties missing");
        res.status(400).send();   // can't process due to 1 or more missing properties
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", "utf8");
    data = JSON.parse(data);

    // Get the id of this new todo
    let nextIdData = fs.readFileSync(__dirname + "/data/" + "next-ids.json", "utf8");
    idData = JSON.parse(nextIdData);

    let nextToDoId = idData.nextTodoId;

    idData.nextTodoId++;
    fs.writeFileSync(__dirname + "/data/" + "next-ids.json", JSON.stringify(idData));

    // Create the todo w/ new id and completed marked as false
    let todo = {
        id: nextToDoId,
        userid: req.body.userid,
        category: req.body.category,
        description: req.body.description,
        deadline: req.body.deadline,
        priority: req.body.priority,
        completed: false
    };

    data.push(todo);
    fs.writeFileSync(__dirname + "/data/" + "todos.json", JSON.stringify(data));

    // LOG data for tracing
    console.log("LOG: New todo added is -> ");
    console.log(todo);

    res.status(201).json(todo);
});

// PUT a todo in order to mark it complete
// note: no data in the body
app.put("/api/todos/:id", urlencodedParser, function (req, res) {
    let id = req.params.id;
    console.log("LOG: Got a PUT request to mark todo " + id + " complete");

    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", "utf8");
    data = JSON.parse(data);

    // Find the requested todo
    let match = data.find(t => t.id == id);

    // If todo not found, can't mark as completed
    if (match == undefined) {
        console.log("LOG: **ERROR: todo does not exist!");
        res.status(404).send();   // not found
        return;
    }

    // Mark the todo complete
    match.completed = true;
    fs.writeFileSync(__dirname + "/data/" + "todos.json", JSON.stringify(data));

    // LOG data for tracing
    console.log("LOG: This todo is complete -> ");
    console.log(match);

    res.status(200).send();
});

/*
// DELETE a todo
app.delete('/api/todos/:id', function (req, res) {
    console.log("LOG: Got a DELETE request for ToDos.  This feature is not implemented.");
    res.status(200).send();
})
*/

// POST a new user
app.post("/api/users", urlencodedParser, function (req, res) {
    console.log("LOG: Got a POST request to add a user");
    console.log("LOG: Message body -------->");
    console.log(JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/" + "users.json", "utf8");
    data = JSON.parse(data);

    // Check for duplicate username
    let matchingUser =
        data.find(u => u.username.toLowerCase() == req.body.username.toLowerCase());

    // If username already exists, return 403
    if (matchingUser != undefined) {
        console.log("LOG: **ERROR: username already exists!");
        res.status(403).send();   // forbidden
        return;
    }

    let user = {
        id: data.length + 1,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    data.push(user);
    fs.writeFileSync(__dirname + "/data/" + "users.json", JSON.stringify(data));

    // LOG data for tracing
    console.log("LOG: New user added is -> ");
    console.log(user);

    res.status(200).send();
});

////////////////////////////////////////////////////
// Start the server

// app.use(express.static("public"));

let server = app.listen(8083, function () {
    let port = server.address().port;
    console.log("App listening at port %s", port);
});
