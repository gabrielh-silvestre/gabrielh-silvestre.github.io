// functions for working with elements

function getOne(element) {
  return document.querySelector(element);
}

function getAll(element) {
  return document.querySelectorAll(element);
}

function createElement(tag) {
  return document.createElement(tag);
}

function addClass(element, newClass) {
  element.classList.add(newClass);
}

function toggleClass(element, alternateClass) {
  element.classList.toggle(alternateClass);
}

function removeClass(element, delClass) {
  element.classList.remove(delClass);
}

function plugHtml(fatherElement, sonElement) {
  fatherElement.appendChild(sonElement);
}

function addMultiplesListeners(arr, eventName, listener) {
  arr.forEach((element) => {
    element.addEventListener(eventName, listener, false);
  });
}

function addMultiplesEventsAndListeners(arr, eventsName, listener) {
  const events = eventsName.split(' ');

  arr.forEach((element) => {
    events.forEach((event) => {
      element.addEventListener(event, listener, false);
    });
  });
}

// global variables

const user = {
  taskContent: '',
  allTasks: [],
};

const staticElements = {
  inputTextTask: getOne('#texto-tarefa'),
  taskList: getOne('#lista-tarefas'),
  buttonCreateTask: getOne('#criar-tarefa'),
  buttonDeleteAll: getOne('#apaga-tudo'),
  buttonDeleteDone: getOne('#remover-finalizados'),
  buttonDeleteSelected: getOne('#remover-selecionado'),
  buttonSave: getOne('#salvar-tarefas'),
  buttonMoveUp: getOne('#mover-cima'),
  buttonMoveDown: getOne('#mover-baixo'),
};

// functions for the project

function resetTaskSelection() {
  user.allTasks.forEach((task) => {
    removeClass(task, 'selected');
  });
}

function selectTask(event) {
  resetTaskSelection();
  addClass(event.target, 'selected');
}

function completeTask(event) {
  toggleClass(event.target, 'completed');
}

function taskEvents(event) {
  if (event.type !== 'dblclick') {
    selectTask(event);
  } else {
    completeTask(event);
  }
}

function lintenTaskItem() {
  const allTasks = getAll('li');
  if (allTasks.length > 0) {
    addMultiplesEventsAndListeners(allTasks, 'click dblclick', taskEvents);
  }
}

function getTaskContent(event) {
  user.taskContent = event.target.value;
}

function taskListInput() {
  staticElements.inputTextTask.addEventListener('keyup', getTaskContent);
}

function saveTask(taskItem) {
  user.allTasks.push(taskItem);
}

function createTask() {
  const newTask = createElement('li');
  newTask.innerText = user.taskContent;
  saveTask(newTask);
}

function resetTaskList() {
  user.allTasks.forEach((task) => {
    task.remove();
  });
}

function resetAllTasks() {
  user.allTasks.length = 0;
}

function renderTask() {
  user.allTasks.forEach((task) => {
    plugHtml(staticElements.taskList, task);
  });
  lintenTaskItem();
}

function resetInput() {
  staticElements.inputTextTask.value = '';
}

function taskCreation() {
  resetInput();
  createTask();
  resetTaskList();
  renderTask();
}

function deleteAllTasks() {
  resetTaskList();
  resetAllTasks();
  renderTask();
}

function saveTaskClassPosition(className) {
  let taskClassPosition = '';

  user.allTasks.forEach((task) => {
    const taskClass = task.classList.toString();
    if (taskClass.includes(className)) {
      taskClassPosition = user.allTasks.indexOf(task);
    }
  });

  return taskClassPosition;
}

function deleteClassBased(className) {
  const removeIndex = saveTaskClassPosition(className);
  if (user.allTasks[removeIndex] !== undefined) {
    user.allTasks[removeIndex].remove();
    user.allTasks.splice(removeIndex, 1);
  }
}

function deleteDoneTasks() {
  for (let i = user.allTasks.length; i >= 0; i -= 1) {
    deleteClassBased('completed');
  }
}

function deleteSelectedTask() {
  deleteClassBased('selected');
}

function moveUp() {
  const initialPos = saveTaskClassPosition('selected');
  const tempArr = [...user.allTasks];

  if (initialPos > 0 && initialPos !== '') {
    [user.allTasks[initialPos]] = [tempArr[initialPos - 1]];
    [user.allTasks[initialPos - 1]] = [tempArr[initialPos]];
    renderTask();
  }
}

function moveDown() {
  const initialPos = saveTaskClassPosition('selected');
  const tempArr = [...user.allTasks];

  if (initialPos < user.allTasks.length - 1 && initialPos !== '') {
    [user.allTasks[initialPos]] = [tempArr[initialPos + 1]];
    [user.allTasks[initialPos + 1]] = [tempArr[initialPos]];
    renderTask();
  }
}

function getAllTasks() {
  return JSON.stringify(staticElements.taskList.innerHTML);
}

function saveLocalStorage() {
  localStorage.setItem('task', getAllTasks());
}

function renderSaveTasks() {
  const storageTasks = JSON.parse(localStorage.getItem('task'));
  staticElements.taskList.innerHTML = storageTasks;
  getAll('li').forEach((task) => {
    saveTask(task);
  });
}

const buttonsListeners = {
  criar_tarefa: taskCreation,
  apaga_tudo: deleteAllTasks,
  remover_finalizados: deleteDoneTasks,
  salvar_tarefas: saveLocalStorage,
  mover_cima: moveUp,
  mover_baixo: moveDown,
  remover_selecionado: deleteSelectedTask,
};

function execButton(event) {
  const rightFunc = buttonsListeners[event.target.className];
  rightFunc();
}

window.onload = () => {
  taskListInput();
  addMultiplesListeners(getAll('button'), 'click', execButton);
  renderSaveTasks();
  lintenTaskItem();
};
