// functions for working with elements

function addMultiplesEvents(element, eventsName, listener) {
  const events = eventsName.split(' ');

  events.forEach((event) => {
    element.addEventListener(event, listener, false);
  });
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
  inputTextTask: document.querySelector('#texto-tarefa'),
  taskList: document.querySelector('#lista-tarefas'),
  buttonCreateTask: document.querySelector('#criar-tarefa'),
  buttonDeleteAll: document.querySelector('#apaga-tudo'),
  buttonDeleteDone: document.querySelector('#remover-finalizados'),
  buttonDeleteSelected: document.querySelector('#remover-selecionado'),
  buttonSave: document.querySelector('#salvar-tarefas'),
  generalConfigs: document.querySelector('#general-configs-container'),
};

// functions for the project

function resetTaskSelection() {
  user.allTasks.forEach((task) => {
    task.classList.remove('selected');
  });
}

function selectTask(event) {
  resetTaskSelection();
  event.target.classList.add('selected');
}

function completeTask(event) {
  event.target.classList.toggle('completed');
}

function taskEvents(event) {
  if (event.type !== 'dblclick') {
    selectTask(event);
  } else {
    completeTask(event);
  }
}

function lintenTaskItem() {
  const allTasks = document.querySelectorAll('.task-item');
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
  const newTask = document.createElement('li');
  newTask.classList.add('task-item');
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
    staticElements.taskList.appendChild(task);
  });
  lintenTaskItem();
}

function resetInput() {
  staticElements.inputTextTask.value = '';
  user.taskContent = '';
}

function taskCreation() {
  createTask();
  resetInput();
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
  document.querySelectorAll('.task-item').forEach((task) => {
    saveTask(task);
  });
}

const buttonsListeners = {
  criar_tarefa: taskCreation,
  apaga_tudo: deleteAllTasks,
  remover_finalizados: deleteDoneTasks,
  salvar_tarefas: saveLocalStorage,
  remover_selecionado: deleteSelectedTask,
};

function execButton(event) {
  const rightFunc = buttonsListeners[event.target.id];
  rightFunc();
}

function moveUpAndDow() {
  document.addEventListener('keyup', (event) => {event.key === 'ArrowUp' ? moveUp() : moveDown();});
}

// Animation

const showMenu = anime({
  targets: '#general-configs',
  translateX: 173,
  duration: 300,
  autoplay: false,
  easing: 'linear',
});

const hideMenu = anime({
  targets: '#general-configs',
  translateX: 173,
  duration: 300,
  direction: 'reverse',
  autoplay: false,
  easing: 'linear',
});

function triggerControl(event) {
  event.type === 'mouseenter' ? showMenu.play() : hideMenu.play();
};

function triggerShowMenu() {
  addMultiplesEvents(staticElements.generalConfigs, 'mouseenter mouseleave', triggerControl);
};

window.onload = () => {
  triggerShowMenu();
  taskListInput();
  addMultiplesListeners(document.querySelectorAll('button'), 'click', execButton);
  moveUpAndDow();
  renderSaveTasks();
  lintenTaskItem();
};
