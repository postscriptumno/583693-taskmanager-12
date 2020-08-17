import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import NoTaskView from "./view/no-task.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition, replace, remove} from "./utils/render.js";

const TASKS_COUNT = 30;
const TASKS_COUNT_PER_STEP = 8;

const tasks = new Array(TASKS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);
  render(boardComponent, taskListComponent, RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTaskView(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent, new SortView(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASKS_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASKS_COUNT_PER_STEP) {
    let renderedTaskCount = TASKS_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASKS_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASKS_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
