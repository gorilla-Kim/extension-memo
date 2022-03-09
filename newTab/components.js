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
                    status: newStatus,
                    updated_at: new Date().toLocaleString()
                }
            }
            return todo
        })]
        chrome.storage.sync.set({[storageKeys.todos]: newTodos});
        setTodoElements(newTodos)
    })
}
function deleteBtnHandler(event){
    const $parent = event.target.parentElement
    const $checkbox = $parent.querySelector('input')
    const id = $checkbox.dataset.id
    chrome.storage.sync.get(storageKeys.todos,  function(result) {
      const filteredTodos = result.todos.filter(todo => todo.id !== id)
        chrome.storage.sync.set({[storageKeys.todos]: filteredTodos});
        setTodoElements(filteredTodos)
    })
}

function Todo({id, status, content, created_at, updated_at}, index) {
    const dates = updated_at ? updated_at.split(' ') : created_at.split(' ')

    const $todoWrapper = document.createElement('div');
    const $delete = document.createElement('div');
    const $contentWrapper = document.createElement('div');
    const $checkbox = document.createElement('input')
    $todoWrapper.className="todo-wrapper"
    $contentWrapper.className="todo-contents"
    $delete.className="todo-delete"

    $checkbox.type="checkbox"
    $checkbox.checked = status === "completed"
    $checkbox.dataset.id=id
    $checkbox.addEventListener('change',checkboxHandler)
    $delete.addEventListener('click', deleteBtnHandler)
    $contentWrapper.innerHTML = `
        <div>${index+1}.</div>
        <div class="todo">${content}</div>
        <div>${dates[1]}${dates[2]}${dates[3]}${dates[4]}</div> 
    `;
    $todoWrapper.appendChild($checkbox)
    $todoWrapper.appendChild($contentWrapper)
    $todoWrapper.appendChild($delete)
    return $todoWrapper
}

function Todos(target, todos){
    target.innerHTML = ''
    todos?.forEach((todo, index) => {
        target.appendChild(Todo(todo, index))
    })
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}