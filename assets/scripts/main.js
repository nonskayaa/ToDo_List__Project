const form = document.querySelector(".todo-list__form");
const taskInput = document.querySelector(".todo-list__input-box");
const tasksList = document.querySelector(".task-list");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

if (checkIsTasksEmpty()) {
  document.querySelector(".todo-list__clear-btn").classList.add("none");
}

form.addEventListener("submit", addTask);

tasksList.addEventListener("click", deleteTask);

tasksList.addEventListener("click", doneTask);

tasksList.addEventListener("click", deleteAllDoneTask); //

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;

  if (taskText.length === 0) {
    alert("Ты ничего не ввел !");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  renderTask(newTask);

  taskInput.value = "";

  document.querySelector(".todo-list__clear-btn").classList.remove("none");
  saveToLocalStorage();
  checkIsTasksEmpty();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".task-list__item");
  const parentId = Number(parentNode.id);

  tasks = tasks.filter((task) => task.id !== parentId);

  parentNode.remove();

  saveToLocalStorage();
  if (checkIsTasksEmpty()) {
    document.querySelector(".todo-list__clear-btn").classList.add("none");
  }
}

function deleteAllDoneTask(event) {
  if (event.target.dataset.action !== "deleteAllDoneTask") return;

  let doneTasks = tasks.filter((task) => task.done === true);
  if (doneTasks.length === 0) {
    console.log('nklvn');
    alert("У тебя еще нет выполненных задачек !");
    return;
  }

  tasks = tasks.filter((task) => task.done !== true);

  for (let i = 0; i < doneTasks.length; i++) {
    document.getElementById(doneTasks[i].id).remove();
  }

  if (checkIsTasksEmpty()) {
    document.querySelector(".todo-list__clear-btn").classList.add("none");
  }
  saveToLocalStorage();
}
function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".task-list__item");
  const parentId = Number(parentNode.id);

  const task = tasks.find((task) => task.id === parentId);
  task.done = !task.done;

  const taskTitle = parentNode.querySelector(".task__title");
  const btn = parentNode.querySelector(".btn-check");

  taskTitle.classList.toggle("task__title--done");
  btn.classList.toggle("btn-check--done");

  saveToLocalStorage();
}

function checkIsTasksEmpty() {
  if (tasks.length === 0) {
    const emptyTaskListHTML = ` <li class="task-list__item-empty">
    <p class="item-empty__title">Пока у тебя </br>нет задачек</p>
    <img src="assets/img/emoji_sad.png" alt="sad emoji" class="item-empty__emoji">
   
  </li> `;
    tasksList.insertAdjacentHTML("afterbegin", emptyTaskListHTML);
    return true;
  } else {
    const emptyTaskListElement = document.querySelector(
      ".task-list__item-empty"
    );
    emptyTaskListElement ? emptyTaskListElement.remove() : null;
    return false;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssTitleClass = task.done
    ? "task__title task__title--done"
    : "task__title";
  const cssBtnClass = task.done ? "btn-check btn-check--done" : "btn-check";

  const taskHTML = `<li id="${task.id}" class="task-list__item">
  <div class="task__left-side">
    <button class="${cssBtnClass}" data-action = "done"></button>
    <h5 class="${cssTitleClass}">${task.text}</h5> 
  </div>
  <button class="btn-delete" data-action = "delete">
      <img src="assets/img/delete.png" alt="delete">
  </button>
  </li>`;
  tasksList.insertAdjacentHTML("afterbegin", taskHTML);
}
