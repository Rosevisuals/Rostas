document.addEventListener('DOMContentLoaded', getTasks);


document.getElementById('filter-tasks').addEventListener('change', filterTasks);



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
document.addEventListener('DOMContentLoaded', () => {
    getTasks();

    const addBtn = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoTime = document.getElementById('todo-time');
    const todoList = document.getElementById('todo-list');

    addBtn.addEventListener('click', addTask);
    document.getElementById('filter-tasks').addEventListener('change', filterTasks);

    function addTask() {
        const taskText = todoInput.value;
        const taskDate = todoDate.value;
        const taskTime = todoTime.value;

        if (taskText && taskDate && taskTime) {
            const task = {
                text: taskText,
                date: taskDate,
                time: taskTime,
                completed: false,
            };

            addTaskToDOM(task);
            saveLocalTasks(task);
            setReminder(task);
            todoInput.value = '';
            todoDate.value = '';
            todoTime.value = '';
        } else {
            alert('Please fill in all fields');
        }
    }

    function addTaskToDOM(task) {
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `
            <span>${task.text} - ${task.date} ${task.time}</span>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
        `;
        todoList.appendChild(taskElement);
        
        taskElement.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            taskElement.classList.toggle('completed', task.completed);
            updateLocalTasks();
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            removeLocalTask(task.text);
            todoList.removeChild(taskElement);
        });
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
            addTaskToDOM(task);
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

    function removeLocalTask(taskText) {
        let tasks = getLocalTasks();
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateLocalTasks() {
        let tasks = [];
        document.querySelectorAll('li').forEach(item => {
            const taskText = item.querySelector('span').textContent.split(' - ')[0];
            const completed = item.classList.contains('completed');
            tasks.push({
                text: taskText,
                completed: completed
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function setReminder(task) {
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const reminderDateTime = new Date(taskDateTime);
        
        // Set reminder to be 2 days before the task date
        reminderDateTime.setDate(taskDateTime.getDate() - 2);
    
        // Check periodically if it's time to show a reminder
        setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= reminderDateTime && currentTime < taskDateTime) {
                alert(`Reminder: Your task "${task.text}" is due in 2 days.`);
            }
        }, 60 * 60 * 1000); // Check every hour
    }
});