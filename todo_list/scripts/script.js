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
  subContent: '',
  taskContent: '',
  allTasks: [],
  configMenu: false,
  subInput: false,
  onFocusTask: [],
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
  secondaryMenu: document.querySelector('#mouse-2-menu'),
  subTaskInput: document.querySelector('#subtask_input'),
};

// functions for the project

function getFocusTask(event) {
  user.onFocusTask.push(event.target.parentNode);
}

function resetFocusTask() {
  user.onFocusTask.length = 0;
}

function resetTaskSelection() {
  user.allTasks.forEach((task) => {
    task.content.classList.remove('selected');
  });
}

function selectTask(event) {
  if (event.target.className.includes('task-title')) {
    resetTaskSelection();
    event.target.classList.add('selected');
  }
}

function completeTask(event) {
  event.target.classList.toggle('completed');
}

function completeTaskSecMenu() {
  user.onFocusTask[0].firstChild.classList.add('completed');
}

function taskEvents(event) {
  if (event.type !== 'dblclick') {
    selectTask(event);
  } else {
    completeTask(event);
    saveLocalStorage();
  }
}

function lintenTaskItem() {
  const allTasks = document.querySelectorAll('.task-item');
  if (allTasks.length > 0) {
    addMultiplesEventsAndListeners(allTasks, 'click dblclick', taskEvents);
  }
}

function getTaskContent(event) {
  if (event.which === 13) {
    taskCreation();
    saveLocalStorage();
  } else {
    user.taskContent = event.target.value;
  }
}

function getSubTaskContent(event) {
  if (event.which === 13) {
    insertSubTask();
    saveLocalStorage();
  } else {
    user.subContent = event.target.value;
  }
}

function taskListInput() {
  staticElements.inputTextTask.addEventListener('keyup', getTaskContent);
}

function subTaskListInput() {
  staticElements.subTaskInput.addEventListener('keyup', getSubTaskContent);
}

function constructorTask(taskContainer, taskContent, ...taskSubContent) {
  if (taskSubContent.length !== 0) {
    return {container: taskContainer, content: taskContent, subContent: taskSubContent};
  }
  return {container: taskContainer, content: taskContent}
}

function saveTask(taskObj) {
  user.allTasks.push(taskObj);
}

function createTaskContent() {
  const newTaskContent = document.createElement('h3');
  newTaskContent.classList.add('task-title');
  newTaskContent.innerText = user.taskContent;
  return newTaskContent;
}

function createSubTask() {
  const newSubTask = document.createElement('p');
  newSubTask.classList.add('task-sub');
  newSubTask.innerText = user.subContent;
  return newSubTask;
}

function showSubInput() {
  document.querySelector('#subtask_input').style.display = 'flex';
  expandSubInput();
  user.subInput = true;
}

function hideSubInput() {
  collapseSubInput();
  setTimeout(() =>  staticElements.subTaskInput.style.display = 'none', 290);
  user.subInput = false;
}

function triggerSubInput() {
  !user.subInput ? showSubInput() : hideSubInput();
}

function createTaskContainer() {
  const newTaskConatiner = document.createElement('li');
  newTaskConatiner.classList.add('task-item');
  return newTaskConatiner;
}

function insertSubTask() {
  const taskSubContent = createSubTask();
  user.onFocusTask[0].appendChild(taskSubContent);
}

function createTask() {
  const taskContainer = createTaskContainer();
  const taskContent = createTaskContent();
  taskContainer.appendChild(taskContent);
  saveTask(constructorTask(taskContainer, taskContent));
}

function resetTaskList() {
  user.allTasks.forEach((task) => {
    task.container.remove();
  });
}

function resetAllTasks() {
  user.allTasks.length = 0;
}

function renderTask() {
  user.allTasks.forEach((task) => {
    staticElements.taskList.appendChild(task.container);
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
    const taskClass = task.content.classList.toString();
    if (taskClass.includes(className)) {
      taskClassPosition = user.allTasks.indexOf(task);
    }
  });

  return taskClassPosition;
}

function deleteClassBased(className) {
  const removeIndex = saveTaskClassPosition(className);
  if (user.allTasks[removeIndex] !== undefined) {
    user.allTasks[removeIndex].container.remove();
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
  const taskItem = JSON.stringify(staticElements.taskList.innerHTML);

  return taskItem;
}

function saveLocalStorage() {
  localStorage.setItem('task', getAllTasks());
}

function saveRenderedTasks() {
  const taskContainer = document.querySelectorAll('.task-item');
  const taskContent = document.querySelectorAll('.task-title');

  taskContainer.forEach((e, i) => saveTask(constructorTask(e, taskContent[i])));
}

function renderSaveTasks() {
  const tasks = JSON.parse(localStorage.getItem('task'));
  staticElements.taskList.innerHTML = tasks;
  saveRenderedTasks();
}

const buttonsListeners = {
  criar_tarefa: taskCreation,
  apaga_tudo: deleteAllTasks,
  remover_finalizados: deleteDoneTasks,
  remover_selecionado: deleteSelectedTask,
  remove_done_task: deleteDoneTasks,
};

function execButton(event) {
  const rightFunc = buttonsListeners[event.target.id];
  rightFunc();
  saveLocalStorage();
}

const secondaryButtonsListeners = {
  create_subtasks: triggerSubInput,
  mark_done_task: completeTaskSecMenu,
  // unselect_task: unSelectTask,
}

function execSecondaryButtons(event) {
  const rightFunc = secondaryButtonsListeners[event.target.id];
  rightFunc();
  saveLocalStorage();
}

const keyListeners = {
  ArrowUp: moveUp,
  ArrowDown: moveDown,
  Delete: deleteSelectedTask,
}

function keyCommands(event) {
  const rightCommand = keyListeners[event.key];
  if (rightCommand) {
    rightCommand();
    saveLocalStorage();
  }
}

function hideSecondaryMenu() {
  collapseSecondayMenu();
  hideSubInput();
  resetFocusTask();
  setTimeout(() => staticElements.secondaryMenu.style.display = 'none', 290);
}

function showSecondayMenu() {
  staticElements.secondaryMenu.style.display = 'block';
  expandSecondayMenu();
}

function mouseCommands(event) {
  if (event.target.className.includes('task-title')) {
    staticElements.secondaryMenu.style.left = `${event.clientX}px`;
    staticElements.secondaryMenu.style.top = `${event.clientY - 5}px`;

    getFocusTask(event);
    event.preventDefault();
    showSecondayMenu();
  }
}

function execUniversalCommands(event) {
  event.type === 'keyup'
  ? keyCommands(event)
  : mouseCommands(event);
}

// Animation

function showMenu() {
  const show = anime({
    targets: '#general-configs-container',
    translateX: 166,
    easing: 'linear',
    duration: 300,
    autoplay: false,
  });

  user.configMenu = true;
  show.play();
}

function hideMenu() {
  const hide = anime({
    targets: '#general-configs-container',
    translateX: 0,
    easing: 'linear',
    duration: 300,
    autoplay: false,
  });

  user.configMenu = false;
  hide.play();
}

function triggerMenuControl(event) {
  if (event.target === staticElements.generalConfigs && !user.configMenu) {
    showMenu();
  } else if (event.target === staticElements.generalConfigs && user.configMenu) {
    hideMenu();
  }
};

function activeBtnHover(element, initColor) {
  const activeHover = anime({
    targets: element,
    backgroundColor: [initColor, '#4f0a99'],
    color: [initColor, '#F8F9FA'],
    autoplay: false,
    duration: 500,
    easing: 'easeInOutSine',
  });

  activeHover.play();
}

function restartBtnHover(element, initColor) {
  const restartHover = anime({
    targets: element,
    backgroundColor: [initColor, '#39C18C'],
    color: [initColor, '#212529'],
    autoplay: false,
    duration: 500,
    easing: 'easeInOutSine',
  });

  restartHover.play();
}

function triggerBtnColors(event) {
  if (event.type === 'mouseenter') {
    activeBtnHover(event.target, event.target.style.backgroundColor);
  } else if (event.type === 'mouseleave') {
    restartBtnHover(event.target, event.target.style.backgroundColor);
  }
}

function expandSecondayMenu() {
  const secondaryMenu = anime({
    targets: '#mouse-2-menu .secondary-menu-container',
    height: ['5px', '270px'],
    width: ['5px', '195px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}

function collapseSecondayMenu() {
  const secondaryMenu = anime({
    targets: '#mouse-2-menu .secondary-menu-container',
    height: ['270px', '5px'],
    width: ['195px', '5px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}

function expandSubInput() {
  const secondaryMenu = anime({
    targets: '#subtask_input',
    width: ['5px', '260px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}

function collapseSubInput() {
  const secondaryMenu = anime({
    targets: '#subtask_input',
    width: ['260px', '5px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}
 
window.onload = () => {
  taskListInput();
  subTaskListInput();
  staticElements.generalConfigs.addEventListener('click', triggerMenuControl);
  staticElements.secondaryMenu.addEventListener('mouseleave', hideSecondaryMenu);
  addMultiplesEventsAndListeners(document.querySelectorAll('.btn-config'), 'mouseenter mouseleave', triggerBtnColors);
  addMultiplesEvents(document, 'keyup contextmenu', execUniversalCommands);
  addMultiplesListeners(document.querySelectorAll('.btn-config'), 'click', execButton);
  addMultiplesListeners(document.querySelectorAll('.secondary-menu-btn'), 'click', execSecondaryButtons);
  renderSaveTasks();
  lintenTaskItem();
};
