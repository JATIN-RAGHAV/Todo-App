
const getTodos = () =>{

    return fetch('localhost:3000/todos',{
        method:'GET'
    })
    .then(response =>{
        if(!response.ok){
            console.log(response);
            return false;
        }return response.json()
    })
    .then(data => {
        return data
    })
}

const addTodo = (todo) =>{
    return fetch('localhost:3000/todo',{
        method:'POST',
        headers:{
            "content-type":"application/JSON"
        },
        body:JSON.stringify({title:todo})
    })
}



addTodo('this is a new todo')
    .then(response => response.json())
    .then(data => console.log(data))