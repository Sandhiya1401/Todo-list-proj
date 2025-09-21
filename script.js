// script.js
const addTaskButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const clearAllButton = document.getElementById('clearAllButton');
const filterSelect = document.getElementById('filterSelect');

// Load tasks from local storage (optional persistence)
window.onload = loadTasks;

addTaskButton.addEventListener('click', addTask);

// Allow Enter key to add task
taskInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') addTask();
});

clearAllButton.addEventListener('click', clearAllTasks);

filterSelect.addEventListener('change', filterTasks);

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(taskText);
  saveTask(taskText);
  taskInput.value = "";
}

function createTaskElement(taskText, completed = false) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  if (completed) taskItem.classList.add('completed');

  checkbox.addEventListener('change', () => {
    taskItem.classList.toggle('completed');
    updateLocalStorage();
  });

  const taskName = document.createElement('span');
  taskName.textContent = taskText;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => {
    taskList.removeChild(taskItem);
    updateLocalStorage();
  });

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskName);
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
}

// Save tasks in localStorage
function saveTask(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks on page load
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.completed));
}

// Update localStorage after delete/complete
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(item => {
    tasks.push({
      text: item.querySelector('span').textContent,
      completed: item.classList.contains('completed')
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear all tasks
function clearAllTasks() {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
}

// Filter tasks: All / Completed / Pending
function filterTasks() {
  const filter = filterSelect.value;
  const tasks = document.querySelectorAll('.task-item');

  tasks.forEach(item => {
    switch (filter) {
      case "all":
        item.style.display = "flex";
        break;
      case "completed":
        item.style.display = item.classList.contains('completed') ? "flex" : "none";
        break;
      case "pending":
        item.style.display = item.classList.contains('completed') ? "none" : "flex";
        break;
    }
  });
}
