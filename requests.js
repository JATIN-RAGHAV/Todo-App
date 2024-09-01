
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

console.log('hi')
getTodos()
    .then(data => console.log(data))