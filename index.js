const todoSep = "°·‚°·‚";
const countSep = "°°··‚‚";

// Function to add todo from input field
const addTodo = () => {
  const inputEle = document.querySelector("#input");
  let count;
  // Checking if the input is alphanumeric or not
  if (isAlphaNum(inputEle.value)) {
    // Check if todos exist in localStorage or not and then updating localstorage
    let todos = localStorage.getItem("todos")
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
const renderTodos = () =>{
  // Getting the todos from local Storage
  let todos = localStorage.getItem('todos');
  if(todos){
    todos = todos.split(todoSep);
    let todosDiv = document.querySelector('#todos');
    // Going through every todo and appending them to the todos div
    for(let i =0;i<todos.length;i++){
      let todo = createTodo(todos[i]);
      todosDiv.appendChild(todo);
    }
  }
}


// Function to create a todo
const createTodo = (s) => {
  // Creating the elements that will be used
  const [count, todo] = s.split(countSep);
  console.log()
  let containerDiv = document.createElement("div");
  let spanEle = document.createElement("span");
  let completedCheckbox = document.createElement("input");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  // Setting the attributes and textContext
  spanEle.textContent = count + " · " + todo;
  completedCheckbox.setAttribute("type", "checkbox");
  editButton.textContent = "Edit";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute('onclick',`deleteTodo(${count})`);
  containerDiv.setAttribute('id',count);
  // Appending the child elements to container
  containerDiv.appendChild(spanEle);
  containerDiv.appendChild(completedCheckbox);
  containerDiv.appendChild(editButton);
  containerDiv.appendChild(deleteButton);
  return containerDiv;
};

// Function to delete a todo
const deleteTodo = n => {
  // Deleting todo from DOM
  let todo = document.getElementById(n);
  let container = document.querySelector('#todos');
  container.removeChild(todo);
  // Deleting todo from localStorage
  let todos = localStorage.getItem('todos').split(todoSep);
  todos = todos.filter(todo => todo.split(countSep)[0] != n);
  todos = todos.join(todoSep);
  localStorage.setItem('todos', todos);
}


// Event listener for the input field to add todo on pressing enter
let inputEle = document.querySelector('#input');
inputEle.addEventListener('keydown', event =>{
  if(event.key === 'Enter' || event.keycode == 13){
    addTodo();
  }
})