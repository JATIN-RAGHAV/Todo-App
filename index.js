const todoSep = "°·‚°·‚";
const countSep = "°°··‚‚";

// Function to add todo from input field
const addTodo = () => {
  const inputEle = document.querySelector("#input");
  let count;
  // Checking if the input is alphanumeric or not
  if (isAlphaNum(inputEle.value)) {
    // Check if todos exist in localStorage or not and then updating localstorage
    let todos = localStorage.getItem("todos");
    if (todos) {
      count = parseInt(localStorage.getItem("todoCount")) + 1;
      localStorage.setItem("todoCount", count);
      localStorage.setItem(
        "todos",
        todos + todoSep + count + countSep + inputEle.value
      );
    } else {
      count = 1;
      localStorage.setItem("todoCount", "1");
      localStorage.setItem("todos", count + countSep + inputEle.value);
    }
    // Append the newly created todo to the list
    let todosContainer = document.querySelector("#todos");
    let newTodo = createTodo(count + countSep + inputEle.value);
    todosContainer.appendChild(newTodo);
  } else {
    alert("enter a valid todo with only alphabets and numbers");
  }
  // Resetting the input value
  inputEle.value = "";
};

// Function to check if a string is alphanumeric or not
const isAlphaNum = (s) => {
  for (c of s) {
    let charCode = c.charCodeAt(0);
    if (
      !(charCode > 47 && charCode < 58) &&
      !(charCode > 96 && charCode < 123) &&
      !(charCode > 64 && charCode < 91)
    ) {
      return false;
    }
  }
  return true;
};

// Function to render todos from local Storage
const renderTodos = () => {
  // Getting the todos from local Storage
  let todos = localStorage.getItem("todos");
  if (todos) {
    todos = todos.split(todoSep);
    let todosDiv = document.querySelector("#todos");
    // Going through every todo and appending them to the todos div
    for (let i = 0; i < todos.length; i++) {
      let todo = createTodo(todos[i]);
      todosDiv.appendChild(todo);
    }
  }
};

// Function to create a todo
const createTodo = (s) => {
  // Creating the elements that will be used
  const [count, todo] = s.split(countSep);
  console.log();
  let containerDiv = document.createElement("div");
  let spanEle = document.createElement("span");
  let completedCheckbox = document.createElement("input");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  // Setting the attributes and textContext
  spanEle.textContent = count + " · " + todo;
  completedCheckbox.setAttribute("type", "checkbox");
  editButton.textContent = "Edit";
  editButton.setAttribute("onclick",`handleEdit(${count})`);
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("onclick", `deleteTodo(${count})`);
  containerDiv.setAttribute("id", count);
  // Appending the child elements to container
  containerDiv.appendChild(spanEle);
  containerDiv.appendChild(completedCheckbox);
  containerDiv.appendChild(editButton);
  containerDiv.appendChild(deleteButton);
  return containerDiv;
};

// Function to delete a todo
const deleteTodo = (n) => {
  // Deleting todo from DOM
  let todo = document.getElementById(n);
  let container = document.querySelector("#todos");
  container.removeChild(todo);
  // Deleting todo from localStorage
  let todos = localStorage.getItem("todos").split(todoSep);
  todos = todos.filter((todo) => todo.split(countSep)[0] != n);
  todos = todos.join(todoSep);
  localStorage.setItem("todos", todos);
};

// Event listener for the input field to add todo on pressing enter
let inputEle = document.querySelector("#input");
inputEle.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.keycode == 13) {
    addTodo();
  }
});

// Function that returns an editing div, returns an array of elements to be added in a edit card
let returnEdit = (id) => {
  // Getting todo 
  let todo = document.getElementById(id);
  todo = todo.querySelector('span');
  todo = todo.textContent.split(' · ')[1];

  // Creating elements
  let editField = document.createElement("input");
  let saveButton = document.createElement("button");
  let discardButton = document.createElement("button");

  // Setting attributes to elements
  editField.setAttribute('value',todo);
  saveButton.textContent = 'Save';
  saveButton.setAttribute('onclick',`handleSave(${id})`);
  discardButton.textContent = 'Discard';

  // Returning elements as members of a list
  return [editField, saveButton, discardButton]
};

// Function to edit a todo
const editTodo = (id) => {
  // Getting updated todo text
  let todo = document.getElementById(id);
  todo = todo.querySelector('input')
  todo = todo.value;

  // Setting the new todo in the locaStorage;
  let todos = localStorage.getItem("todos");
  todos = todos.split(todoSep);
  todos.map(todo => {
    if(todo.split(countSep)[0] == id){
      return id+countSep+todo;
    }
    return todo;
  })
  todos = todos.join(todoSep);
  localStorage.setItem('todos', todos)
  // Return todo in the end for further use
  return todo;
}

// Function to handle when edit button is clicked
const handleEdit = (id) =>{
  // Getting todo card and edit card
  let todoCard = document.getElementById(id);
  let EditCard = returnEdit(id);
  
  // Removing the todo card and adding edit card
  todoCard.innerHTML = '';
  todoCard.appendChild(EditCard[0]);
  todoCard.appendChild(EditCard[1]);
  todoCard.appendChild(EditCard[2]);
}


// Function to handle when save is clicked on edit
const handleSave = (id) =>{
  // Edit todo and save it to local storage and get the new todo
  const todoString = editTodo(id);

  // Creating new todo and replacing the edit card with the todocard
  const todoCard = createTodo(id+countSep+todoString);
  let todoCardDOM = document.getElementById(id);
  todoCardDOM.innerHTML = '';
  console.log(todoCard)
  todoCardArray = todoCard.querySelectorAll('*');
  console.log(todoCardArray[0])
  todoCardDOM.appendChild(todoCardArray[0]);
  todoCardDOM.appendChild(todoCardArray[1]);
  todoCardDOM.appendChild(todoCardArray[2]);
  todoCardDOM.appendChild(todoCardArray[3]);
}

