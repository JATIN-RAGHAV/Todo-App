const todoSep = "°·‚°·‚";
const countSep = "°°··‚‚";
const completedSep = "⁄€‹⁄€‹";

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
        todos + todoSep + count + countSep + inputEle.value + completedSep + 'N'
      );
    } else {
      count = 1;
      localStorage.setItem("todoCount", "1");
      localStorage.setItem("todos", count + countSep + inputEle.value + completedSep + 'N');
    }
    // Append the newly created todo to the list
    let todosContainer = document.querySelector("#todos");
    let newTodo = createTodo(count + countSep + inputEle.value, 'N');
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
      !(charCode > 64 && charCode < 91) &&
      !(charCode == 32)
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
    console.log(todos)
    todos = todos.split(todoSep);
    let todosDiv = document.querySelector("#todos");
    let completedTodosDiv = document.querySelector('#todosCompleted');
    // Going through every todo and appending them to the todos div
    for (let i = 0; i < todos.length; i++) {
      let split = todos[i].split(completedSep);
      if(split[1] == 'N'){
        let todo = createTodo(split[0]);
        todosDiv.appendChild(todo);
      }else{
        console.log(split)
        let todo = returnTodoCompleted(...split[0].split(countSep))
        completedTodosDiv.appendChild(todo);
        completedTodosDiv.parentElement.setAttribute('style', 'display:solid')
      }
    }
  }
};

// Function to create a todo
const createTodo = (s) => {
  // Creating the elements that will be used
  const [count, todoC] = s.split(countSep);
  const todo = todoC.split(completedSep)[0];
  let containerDiv = document.createElement("div");
  let spanEle = document.createElement("span");
  let completedCheckbox = document.createElement("input");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  // Setting the attributes and textContext
  spanEle.textContent = count + " · " + todo
  completedCheckbox.setAttribute("type", "checkbox");
  editButton.textContent = "Edit";
  editButton.setAttribute("onclick", `handleEdit(${count})`);
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("onclick", `deleteTodo(${count})`);
  containerDiv.setAttribute("id", count);
  // Adding event listener to the completed checkbox
  completedCheckbox.addEventListener('change',() => {
    return setCompleted(count);
  });
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
  deleteFromLocal(n);
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
  todo = todo.querySelector("span");
  todo = todo.textContent.split(" · ")[1];

  // Creating elements
  let editField = document.createElement("input");
  let saveButton = document.createElement("button");
  let discardButton = document.createElement("button");

  // Setting attributes to elements
  editField.setAttribute("value", todo);
  saveButton.textContent = "Save";
  saveButton.setAttribute("onclick", `handleSave(${id})`);
  discardButton.textContent = "Discard";
  discardButton.setAttribute("onclick", `handleDiscard(${id},"${todo}")`);

  // Returning elements as members of a list
  return [editField, saveButton, discardButton];
};

// Function to edit a todo
const editTodo = (id) => {
  // Getting updated todo text
  let newTodo = document.getElementById(id);
  newTodo = newTodo.querySelector("input");
  newTodo = newTodo.value;
  if (isAlphaNum(newTodo)) {
    // Setting the new todo in the locaStorage;
    let todos = localStorage.getItem("todos");
    todos = todos.split(todoSep);
    todos = todos.map((todo) => {
      console.log(todo.split(countSep));
      if (todo.split(countSep)[0] == id) {
        console.log(`inside todo ${id}  ${newTodo}`);
        return id + countSep + newTodo + completedSep + 'N';
      }
      return todo;
    });
    todos = todos.join(todoSep);
    localStorage.setItem("todos", todos);
    // Return todo in the end for further use
    return newTodo;
  } else {
    return false;
  }
};

// Function to handle when edit button is clicked
const handleEdit = (id) => {
  // Getting todo card and edit card
  let todoCard = document.getElementById(id);
  let EditCard = returnEdit(id);

  // Removing the todo card and adding edit card
  todoCard.innerHTML = "";
  todoCard.appendChild(EditCard[0]);
  todoCard.appendChild(EditCard[1]);
  todoCard.appendChild(EditCard[2]);
};

// Function to handle when save is clicked on edit
const handleSave = (id) => {
  // Edit todo and save it to local storage and get the new todo
  const todoString = editTodo(id);
  if (!todoString) {
    alert("enter a valid todo with only alphabets and numbers");
  } else {
    // Creating new todo and replacing the edit card with the todocard
    const todoCard = createTodo(id + countSep + todoString);
    let todoCardDOM = document.getElementById(id);
    editToTodo(todoCardDOM, todoCard);
  }
};

// Function to handle discardButton
const handleDiscard = (n, s) => {
  // Get todo Card and edit card
  let todoCard = createTodo(n + countSep + s);
  let todoCardDom = document.getElementById(n);
  editToTodo(todoCardDom, todoCard);
};

// Function to replace edit card with the give todo card
const editToTodo = (edit, todo) => {
  edit.innerHTML = "";
  todoCardArray = todo.querySelectorAll("*");
  edit.appendChild(todoCardArray[0]);
  edit.appendChild(todoCardArray[1]);
  edit.appendChild(todoCardArray[2]);
  edit.appendChild(todoCardArray[3]);
};

// Function to add a todo to completed given it's id
const setCompleted = (id) =>{
  // Get todo text and remove todo card from DOM
  const todoText = getTodo(id);
  const completedTodo = returnTodoCompleted(id, todoText);
  setCompletedStorage(id);
  // Checking if completedTodo has some elements or not and changin its display approprirately
  let completedTodos = document.querySelector('#todosCompleted');
  completedTodos.prepend(completedTodo);
  if(completedTodos.childElementCount == 1){
    let container = document.querySelector('#todosCompletedContainer')
    container.setAttribute('style', 'display:solid')
    console.log(container)
  }
}

// Function to remove a todo given it's id and return the todo text
const getTodo = (id) =>{
  // Get the todo card and return only it's inner text and remove it from DOM
  let todo = document.getElementById(id);
  let todoText = todo.querySelector('span')
  todoText = todoText.textContent.split(' · ')[1];
  todo.parentElement.removeChild(todo);
  return todoText;
}

// Function to add a todo to completed div given its id and text
const returnTodoCompleted = (id, text) =>{
  // Creating required elements
  let containerDiv = document.createElement('div');
  let spanEle = document.createElement('span');
  let button = document.createElement('button');
  // Adding required attributes
  spanEle.textContent = id + ' · ' + text;
  button.textContent = 'Delete';
  button.setAttribute('onclick', `deleteCompletedTodo(${id})`);
  containerDiv.setAttribute('id', id);
  containerDiv.appendChild(spanEle);
  containerDiv.appendChild(button);
  return containerDiv;
}

// Function to deleted todos from completed section
const deleteCompletedTodo = (id) =>{
  // Deleting todo from DOM
  let completedTodo = document.getElementById(id);
  let parentEle = completedTodo.parentElement;
  parentEle.removeChild(completedTodo);
  if(parentEle.childElementCount == 0){
    parentEle.parentElement.setAttribute('style','display:none;')
  }
  // Deleting todo from local Storage
  deleteFromLocal(id);
}

// Function to set todo to completed in local storage
const setCompletedStorage = (id) =>{
  let todos = localStorage.getItem('todos');
  todos = todos.split(todoSep);
  todos = todos.map(todo =>{
    if(todo.split(countSep)[0] == id){
      return todo.split(completedSep)[0] + completedSep + 'Y';
    }
    return todo
  })
  todos = todos.join(todoSep)
  localStorage.setItem('todos', todos);
}

// Function to delete todo from local storage
const deleteFromLocal = (id) =>{
  let todos = localStorage.getItem("todos").split(todoSep);
  todos = todos.filter((todo) => todo.split(countSep)[0] != id);
  todos = todos.join(todoSep);
  localStorage.setItem("todos", todos);
}