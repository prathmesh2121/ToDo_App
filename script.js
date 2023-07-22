const submitTask = document.getElementById("submitTask");
const priority = document.getElementById("priority");
const userTask = document.getElementById("task-details");
const taskList = document.getElementById("task-list");

submitTask.addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission default behavior

  const todoText = userTask.value;

  if (!todoText) {
    alert("Please enter a task....");
    return;
  }

  const todo = {
    todoText: todoText,
    priority: priority.value
  };

  fetch("http://localhost:3000/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then(function(data) {
      showToDoInUI(data, data.id); // Pass the task ID to showToDoInUI
    })
    .catch(function(error) {
      console.log(error.message);
    });
});

function showToDoInUI(todo, taskId) {
  const todoTextNode = document.createElement("li");
  const todoTitle = document.createElement("span");
  const checkBoxBtn = document.createElement("input");

  todoTitle.innerText = `Task: ${todo.todoText}, Priority: ${todo.priority}`;
  todoTextNode.id = `task-${taskId}`;
  checkBoxBtn.type = "checkbox"; 
  checkBoxBtn.classList.add("check")



  checkBoxBtn.addEventListener("change", function () {
    if (checkBoxBtn.checked) {
      todoTitle.style.textDecoration = "line-through"; // Add strikethrough style
    } else {
      todoTitle.style.textDecoration = "none"; // Remove strikethrough style
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "DELETE";
  deleteBtn.classList.add("delete-btn");
  
  // Add an event listener to the delete button
  deleteBtn.addEventListener("click", function () {
    deleteTask(taskId); // Call the deleteTask function when the "Delete" button is clicked
  });

 
  todoTextNode.appendChild(todoTitle);
  todoTextNode.appendChild(deleteBtn);
  todoTextNode.appendChild(checkBoxBtn);


  
  const space = document.createElement("br");
  todoTextNode.appendChild(space);
  taskList.appendChild(todoTextNode);
}


function deleteTask(taskId) {
  // Send a DELETE request to the server
  fetch(`http://localhost:3000/todo/${taskId}`, {
    method: "DELETE"
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    // Remove the corresponding task item from the UI
    const taskItem = document.getElementById(`task-${taskId}`);
    if (taskItem) {
      taskItem.remove();
    }
  })
  .catch(function(error) {
    console.log(error.message);
  });
}

fetch("http://localhost:3000/todo-data")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Something went wrong");
    }
  })
  .then(function(todos) {
    todos.forEach(function(todo) {
      showToDoInUI(todo, todo.id); // Pass the task ID to showToDoInUI
    });
  })
  .catch(function(error) {
    console.log(error.message);
  });
