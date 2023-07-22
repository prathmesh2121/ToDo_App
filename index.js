const express = require('express');
const fs = require("fs");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/todo.html");
});

app.delete("/todo/:id", function(req, res) {
  const taskId = parseInt(req.params.id);

  deleteTodoFromFile(taskId, function(err) {
    if (err) {
      res.status(500).send("Error deleting task");
      return;
    }

    res.status(200).send("Task deleted successfully");
  });
});

function deleteTodoFromFile(taskId, callback) {
  readAllTodos(function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    const filteredData = data.filter(task => task.id !== taskId);

    fs.writeFile("./database.js", JSON.stringify(filteredData), function(err) {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  });
}

app.post("/todo", function(req, res) {
  console.log(req.body);
  saveTodoInFile(req.body, function(err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    res.status(200).json(data);
  });
});

app.get("/todo-data", function(req, res) {
  readAllTodos(function(err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    res.status(200).json(data);
  });
});

app.listen(3000, function() {
  console.log("Running on 3000");
});

function readAllTodos(callback) {
  fs.readFile("./database.js", "utf-8", function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    let todos;
    try {
      todos = JSON.parse(data);
    } catch (err) {
      todos = [];
    }

    callback(null, todos);
  });
}

function saveTodoInFile(todo, callback) {
  readAllTodos(function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    // Find the maximum id in the existing data
    let maxId = 0;
    data.forEach(task => {
      if (task.id > maxId) {
        maxId = task.id;
      }
    });

    // Add a unique ID to the new todo
    todo.id = maxId + 1;

    data.push(todo);

    fs.writeFile("./database.js", JSON.stringify(data), function(err) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, todo);
    });
  });
}
