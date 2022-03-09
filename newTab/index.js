
const storageKeys = {
    isOpen: 'isOpen',
    todos: 'todos'
}
const $btns = document.querySelectorAll('header > div.header-btn')
const $newTodoBtn = document.querySelector('#form-wrapper .new-todo-btn')
const $newTodoText = document.querySelector('#form-wrapper input')
const $todoWrapper = document.querySelector('#todos-wrapper')

chrome.storage.sync.get(storageKeys.todos,  function(result) {
    const { todos } = result
    localStorage.setItem('active-btn', 'all')
    Todos($todoWrapper, todos)
})

function activeToggle($target) {
    $btns.forEach(item => item.classList.remove('active'))
    $target.classList.add('active')
}

$btns.forEach($btn => {
    $btn.addEventListener('click',function(event){
        const {target} = event
        const btnName = target.classList[1]
        chrome.storage.sync.get(storageKeys.todos,  function(result) {
            const { todos } = result
            let filteredTodos = []
            switch (btnName) {
                case 'all':
                    filteredTodos = todos
                    activeToggle(target)
                    break;
                case 'completed':
                    filteredTodos = todos?.filter(todo=>todo.status === "completed") || []
                    activeToggle(target)
                    break;
                case 'working':
                    filteredTodos = todos?.filter(todo=>todo.status === "working") || []
                    activeToggle(target)
                    break
                case 'deleteAll':
                    chrome.storage.sync.remove(storageKeys.todos);
                    break;
            }
            localStorage.setItem('active-btn', btnName)
            Todos($todoWrapper, filteredTodos)
        })
    })
})

// Create
$newTodoBtn.addEventListener('click', function(event){
    event.preventDefault()
    const todo = {
        id: uuidv4(),
        status: "working",
        content: $newTodoText.value,
        created_at: new Date().toLocaleString(),
        updated_at: ""
    }
    chrome.storage.sync.get(storageKeys.todos,  function(result) {
        const isValid = result.todos && typeof result.todos === 'object'
        const todos  = isValid ? [...result.todos, todo] : [todo]
        chrome.storage.sync.set({[storageKeys.todos]: todos});
        setTodoElements(todos)
    })
    $newTodoText.value = ""
})


function setTodoElements(todos) {
    const activeBtn = localStorage.getItem('active-btn')
    if(activeBtn === "working" || activeBtn === "completed") {
        Todos($todoWrapper, todos.filter(todo=>todo.status===activeBtn))
    } else {
        Todos($todoWrapper, todos)
    }
}