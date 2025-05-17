const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

window.onload = loadTask()


function loadTask() {
    if (localStorage.getItem("Tasks") !== null) {
        const savedTasks = localStorage.getItem("Tasks");
        const stringSavedTasks = JSON.parse(savedTasks)
        for (var i = 0; i < stringSavedTasks.length; i++) {
            addTask(stringSavedTasks[i])
            console.log("Hello World")
        }
    }
}

function NewTask() {
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }
    let NewTasks = [];
    const newTaskObj = { text: task, completed: false };
    if (localStorage.getItem("Tasks") !== null) {
        const savedTasks = localStorage.getItem("Tasks");
        const stringSavedTasks = JSON.parse(savedTasks)
        NewTasks = [...stringSavedTasks, newTaskObj]
        localStorage.setItem("Tasks", JSON.stringify(NewTasks))
    } else {
        NewTasks.push(newTaskObj)
        localStorage.setItem("Tasks", JSON.stringify(NewTasks))
    }
    addTask(newTaskObj)
}

function addTask(taskObj) {
    const li = document.createElement("li");
    if (taskObj.completed) {
        li.classList.add("completed");
    }
    li.innerHTML = `
        <label>
            <input type="checkbox" ${taskObj.completed ? "checked" : ""}>
            <span>${taskObj.text}</span>
        </label>
        <span class="edit-btn">
        <img src="edit.svg" alt="edit" width="16" height="16">
        </span>
        <span class="delete-btn">
        <img src="delete.svg" alt="Delete" width="16" height="16">
        </span> `;
    listContainer.appendChild(li);
    inputBox.value = "";
    updateCounters();

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("click", function () {
        li.classList.toggle("completed", checkbox.checked);
        // Update localStorage
        const savedTasks = JSON.parse(localStorage.getItem("Tasks"));
        for (let i = 0; i < savedTasks.length; i++) {
            if (savedTasks[i].text === taskSpan.textContent) {
                savedTasks[i].completed = checkbox.checked;
                break;
            }
        }
        localStorage.setItem("Tasks", JSON.stringify(savedTasks));
        updateCounters();
    });

    editBtn.addEventListener("click", function () {
        const update = prompt("Edit task:", taskSpan.textContent);
        if (update !== null) {
            const savedTasks = JSON.parse(localStorage.getItem("Tasks"));
            for (let i = 0; i < savedTasks.length; i++) {
                if (savedTasks[i].text === taskSpan.textContent) {
                    savedTasks[i].text = update;
                    savedTasks[i].completed = false; // Uncheck in localStorage
                    break;
                }
            }
            localStorage.setItem("Tasks", JSON.stringify(savedTasks));
            taskSpan.textContent = update;
            li.classList.remove("completed");
            checkbox.checked = false;
            updateCounters();
        }
    });

    deleteBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this task?")) {
            const savedTasks = JSON.parse(localStorage.getItem("Tasks"));
            const taskText = taskSpan.textContent;
            for (let i = 0; i < savedTasks.length; i++) {
                if (savedTasks[i].text === taskText) {
                    savedTasks.splice(i, 1)
                    break;
                }
            }
            localStorage.setItem("Tasks", JSON.stringify(savedTasks));
            li.remove();
            updateCounters();
        }
    });
}

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks =
        document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}