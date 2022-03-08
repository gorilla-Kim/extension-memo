function checkboxHandler(event){
    const { dataset, checked } = event.target
    const { id } = dataset
    chrome.storage.sync.get(storageKeys.todos,  function(result) {
        let newStatus = 'working'
        const { todos } = result
        let newTodos = []
        if (checked) {
            newStatus = "completed"
        } else {
            newStatus = "working"
        }
        newTodos = [...todos.map(todo => {
            if(todo.id === id) {
                return {
                    ...todo,
                    status: newStatus
                }
            }
            return todo
        })]
        chrome.storage.sync.set({[storageKeys.todos]: newTodos});
        setTodoElements(newTodos)
    })
}

function Todo({id, status, content, created_at, updated_at}, index) {
    const dates = created_at.split(' ')
    const $el = document.createElement('div');
    $el.className="todo"
    const $checkbox = document.createElement('input')
    $checkbox.type="checkbox"
    $checkbox.checked = status === "completed"
    $checkbox.dataset.id=id
    $checkbox.addEventListener('change',checkboxHandler)
    $el.innerHTML = `
        <div>${index+1}.</div>
        <div class="content">${content}</div>
        <div>${dates[0]}${dates[1]}${dates[2]}</div> 
    `;
    $el.appendChild($checkbox)
    return $el
}

function Todos(target, todos){
    target.innerHTML = ''
    todos.forEach((todo, index) => {
        target.appendChild(Todo(todo, index))
    })
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}