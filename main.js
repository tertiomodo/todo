document.addEventListener("DOMContentLoaded", () => {
  // Массив с делами пользователя (объекты с id, taskName и done внутри)
  let todoArray = [];

  // Создаем заголовок
  function createTitle() {
    const title = document.createElement("h1");
    title.textContent = "To do list";
    title.classList.add("title");
    return title;
  }

  // Создаем форму с кнопкой
  function createForm() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");

    // Кнопка по умолчанию disabled
    button.disabled = true;

    // Если пользователь что-то вводит - кнопка active
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        button.disabled = false;
      }
    });

    // Если пользователь снял фокус с input - кнопка disabled
    input.addEventListener("blur", (event) => {
      if (input.value.length === 0 && event.target) {
        button.disabled = true;
      }
    });

    input.placeholder = "Write your task";
    button.textContent = "Add";

    form.classList.add("flex", "form");
    input.classList.add("input");
    button.classList.add("button");

    form.append(input, button);

    return {
      form,
      input,
      button,
    };
  }

  // Создаем список ul
  function createList() {
    const list = document.createElement("ul");
    return list;
  }

  // Создаем дело в todo (элемент списка - li)
  // task - объект (только что созданное дело)
  function createTodoItem(task) {
    const item = document.createElement("li");
    const taskWrapper = document.createElement("div");
    const checkbox = document.createElement("input");
    const span = document.createElement("span");
    const cross = document.createElement("div");

    checkbox.type = "checkbox";
    span.textContent = task.taskName;

    item.classList.add("flex", "item");
    taskWrapper.classList.add("task-wrapper");
    checkbox.classList.add("checkbox");
    span.classList.add("todo-text");
    cross.classList.add("cross");

    // Если у дела, загруженного с localStorage, был статус true, то зачеркнуть текст и отметить галочку
    if (task.done) {
      checkbox.checked = true;
      span.classList.toggle("done");
    }

    //Добавляем обработчики событий на чекбокс и крестик
    checkbox.addEventListener("click", () => {
      // Поменять статус done на противоположный (с false на true или наоборот)
      task.done = !task.done;

      // Зачеркнуть текст
      span.classList.toggle("done");

      // Вызываем функцию сохранения массива после нажатия на кнопку
      saveArray(todoArray);
    });

    cross.addEventListener("click", () => {
      for (let i = 0; i < todoArray.length; i++) {
        // Если id из общего массива = текущему task id, то:
        if (todoArray[i].id === task.id) {
          // Удалить из массива и DOM данный объект
          todoArray.splice(i, 1);
          item.remove();

          // Вызываем функцию сохранения массива после нажатия на кнопку
          saveArray(todoArray);
          break;
        }
      }
    });

    taskWrapper.append(checkbox, span);
    item.append(taskWrapper, cross);

    return { item };
  }

  // Создаем уникальный id для каждого дела, прибавляя 1 к большему id из массива
  function getId(array) {
    result = 0;

    for (let element of array) {
      if (element.id > result) {
        result = element.id;
      }
    }
    return result + 1;
  }

  // Функция сохраняющая массив с делами в localStorage
  // Вызывается при создании элемента или смене статуса (нажатие на одну из кнопок)
  function saveArray(array) {
    localStorage.setItem("todo", JSON.stringify(array));
  }

  // Создаем todo. Функция вызывается после DOMContentLoaded в самом конце
  function createTodoApp() {
    const container = document.getElementById("container");

    // Вызываем функции для создания заголовка, формы, ul и помещаем их в DOM
    const todoTitle = createTitle();
    const todoForm = createForm();
    const todoList = createList();

    container.append(todoTitle);
    container.append(todoForm.form);
    container.append(todoList);

    // Проверяем, если в localStorage что-то есть, то парсим и помещаем в todoArray
    const getArray = localStorage.getItem("todo");
    if (getArray !== "" && getArray !== null && getArray.length !== 0) {
      todoArray = JSON.parse(getArray);

      // Проходимся по массиву и создаём элементы списка
      for (let element of todoArray) {
        const todoItem = createTodoItem(element);
        todoList.append(todoItem.item);
      }
    }

    // Функция активирующаяся по нажатию на 'Добавить' или Enter
    todoForm.form.addEventListener("submit", function (event) {
      // Отменяет стандартное действие браузера, в данном случае, перезагрузку страницы
      event.preventDefault();

      // Если пользователь ничего не ввел, завершаем функцию
      if (!todoForm.input.value) {
        return;
      }

      // Если пользователь что-то ввел, создаем массив
      const task = {
        // Вызываем функцию создания id, помещая в нее массив
        id: getId(todoArray),

        // Название дела берется из input формы
        taskName: todoForm.input.value,
        done: false,
      };

      // Добавляем созданное дело в массив
      todoArray.push(task);

      // Вызываем функцию создания дела и помещаем его в список ul
      const todoItem = createTodoItem(task);
      todoList.append(todoItem.item);

      // Вызываем функцию сохранения массива после создания дела
      saveArray(todoArray);

      // Очищаем поле и блокируем кнопку после создания дела
      todoForm.input.value = "";
      todoForm.button.disabled = true;
    });
  }

  createTodoApp();
});
