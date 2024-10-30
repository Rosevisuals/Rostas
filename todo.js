document.addEventListener('DOMContentLoaded', getTasks);

document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('filter-tasks').addEventListener('change', filterTasks);

function addTask() {
    const inputValue = document.getElementById('todo-input').value.trim();
    if (inputValue !== "") {
        const todoList = document.getElementById('todo-list');
        const listItem = createTaskElement(inputValue);

        saveLocalTasks(inputValue);
        todoList.appendChild(listItem);
        document.getElementById('todo-input').value = ''; // Clear input field
    }
}

function createTaskElement(taskText) {
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', function() {
        listItem.classList.toggle('completed');
        updateLocalTasks();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
        removeLocalTask(listItem.textContent);
        listItem.remove();
    });

    listItem.appendChild(completeBtn);
    listItem.appendChild(deleteBtn);
    return listItem;
}

function filterTasks(e) {
    const todos = document.querySelectorAll('li');
    todos.forEach(todo => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

// Local Storage Functions
function saveLocalTasks(task) {
    let tasks = getLocalTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = getLocalTasks();
    tasks.forEach(task => {
        const todoList = document.getElementById('todo-list');
        const listItem = createTaskElement(task);
        todoList.appendChild(listItem);
    });
}

function getLocalTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function removeLocalTask(task) {
    let tasks = getLocalTasks();
    tasks.splice(tasks.indexOf(task), 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalTasks() {
    let tasks = [];
    document.querySelectorAll('li').forEach(item => {
        tasks.push(item.textContent.replace('CompleteDelete', '')); // Remove button text
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
