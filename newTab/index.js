
const storageKeys = {
    isOpen: 'isOpen',
    todos: 'todos'
}
const $btns = document.querySelectorAll('header > div.header-btn')
const $newTodoBtn = document.querySelector('#form-wrapper .new-todo-btn')
const $newTodoText = document.querySelector('#form-wrapper input')
const $todoWrapper = document.querySelector('#todo-wrapper')

chrome.storage.sync.get(storageKeys.todos,  function(result) {
    const { todos } = result
    Todos($todoWrapper, todos)
})

$btns.forEach($btn => {
    $btn.addEventListener('click',function(event){
        const {target} = event
        $btns.forEach(item => item.classList.remove('active'))
        const btnName = target.classList[1]
        target.classList.add('active')
        chrome.storage.sync.get(storageKeys.todos,  function(result) {
            const { todos } = result
            let filteredTodos = []
            switch (btnName) {
                case 'all':
                    filteredTodos = todos
                    break;
                case 'completed':
                    filteredTodos = todos.filter(todo=>todo.status === "completed")
                    break;
                case 'working':
                    filteredTodos = todos.filter(todo=>todo.status === "working")
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