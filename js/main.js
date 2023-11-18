//gasesc elementele

const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}



checkEmptyList();

//addd Task dupa submit
form.addEventListener("submit", addTask);

//event de stergere
tasksList.addEventListener("click", deleteTask);

//daca se apasa pe bifa taskul este rezolvat
tasksList.addEventListener("click", doneTask);

//local storage 59:04 verificam daca este asa keye si daca da adaugam in innerHtml

function addTask(event) {
  event.preventDefault(); //blochez expedierea formei

  const taskText = taskInput.value;

  //описываем задачу в виде обьекта

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляем обьект в массив с задачами
  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  //curatim inputul dupa expediere
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}
//stergere task ascultam add event pe tot listul si vedem dupa daca clicul a fost pe X
//in css ca sa nu se vada apasarea pe imaginea din buton sa facut pointer-events:none

function deleteTask(event) {
  //controlam daca click nu a fost pe button delete
  if (event.target.dataset.action !== "delete") {
    return; //daca nu e pe delete atunci cu return iesim cu totul din functie
  }
  //daca butonul este dataset delete se face codul mai departe
  const parentNode = event.target.closest(".list-group-item"); //gasim parintele li
  parentNode.remove(); //stergem parintele

  //stergem din tasks
  const id = Number(parentNode.id);

  //stergem prin filtrare de massiv
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") {
    return; //daca nui pe done iesim din functie
  }
  //daca butonul este dataset done
  const parentNode = event.target.closest(".list-group-item"); //gasim parintele li

  //gassim id a lui task
  const id = Number(parentNode.id);

  //intoarce nu index da elememtul
  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  console.log(task);

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
    <li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //formam css class
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
          <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18">
          </button>
          <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
          </button>
      </div>
  </li>`;

  //adaugam pe pagina
  tasksList.insertAdjacentHTML("beforeend", taskHtml);
}
