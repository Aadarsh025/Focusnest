
/* =====================================================
   FOCUSNEST JAVASCRIPT
   Improved + Safer Version
===================================================== */


/* =====================================================
   GLOBAL STATE
===================================================== */

let selectedDuration = 25;

/*
   Temporary in-memory storage.

   If localStorage fails for any reason, the app
   will still work during the current page session.
*/
let memoryUser = null;
let memoryTasks = [];
let memoryCurrentTask = null;


/* =====================================================
   ELEMENTS
===================================================== */

const loginScreen =
    document.getElementById("loginScreen");

const mainApp =
    document.getElementById("mainApp");

const loginForm =
    document.getElementById("loginForm");

const userNameInput =
    document.getElementById("userName");

const userEmailInput =
    document.getElementById("userEmail");

const greeting =
    document.getElementById("greeting");

const profileName =
    document.getElementById("profileName");

const profileInitial =
    document.getElementById("profileInitial");

const taskModal =
    document.getElementById("taskModal");

const openTaskButton =
    document.getElementById("openTaskModal");

const closeTaskButton =
    document.getElementById("closeTaskModal");

const taskForm =
    document.getElementById("taskForm");

const taskNameInput =
    document.getElementById("taskName");

const taskDescriptionInput =
    document.getElementById("taskDescription");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const taskCount =
    document.getElementById("taskCount");

const focusTime =
    document.getElementById("focusTime");

const presets =
    document.querySelectorAll(".preset");


/* =====================================================
   STORAGE HELPERS
===================================================== */

/*
   Safely read data from localStorage.
*/
function getStorage(key, fallback = null) {

    try {

        const data =
            localStorage.getItem(key);

        if (data === null) {
            return fallback;
        }

        return JSON.parse(data);

    }

    catch (error) {

        console.warn(
            `Could not read ${key} from localStorage.`,
            error
        );

        return fallback;

    }

}


/*
   Safely write data to localStorage.

   If storage fails, the app continues working
   using memory variables.
*/
function setStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    }

    catch (error) {

        console.warn(
            `Could not save ${key}. Using temporary memory instead.`,
            error
        );

        return false;

    }

}


/*
   Safely remove data.
*/
function removeStorage(key) {

    try {

        localStorage.removeItem(key);

    }

    catch (error) {

        console.warn(
            `Could not remove ${key}.`,
            error
        );

    }

}


/* =====================================================
   USER STORAGE
===================================================== */

function getUser() {

    const storedUser =
        getStorage(
            "focusnestUser",
            null
        );

    if (storedUser) {

        memoryUser =
            storedUser;

        return storedUser;

    }

    return memoryUser;

}


function saveUser(user) {

    memoryUser =
        user;

    setStorage(
        "focusnestUser",
        user
    );

}


function getTasks() {

    const storedTasks =
        getStorage(
            "focusnestTasks",
            null
        );

    if (Array.isArray(storedTasks)) {

        memoryTasks =
            storedTasks;

        return storedTasks;

    }

    return memoryTasks;

}


function saveTasks(tasks) {

    memoryTasks =
        tasks;

    setStorage(
        "focusnestTasks",
        tasks
    );

}


/* =====================================================
   APPLICATION START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    /*
       If some HTML elements don't exist,
       stop safely instead of throwing errors.
    */

    if (
        !loginScreen ||
        !mainApp
    ) {

        console.warn(
            "FocusNest: Main application elements are missing."
        );

        return;

    }


    const user =
        getUser();


    /*
       User already logged in
       → directly show application.
    */

    if (user && user.name) {

        showApplication(user);

    }

    else {

        loginScreen.style.display =
            "flex";

        mainApp.style.display =
            "none";

    }


    initializeTaskEvents();

}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


function handleLogin(event) {

    event.preventDefault();


    const name =
        userNameInput
            ? userNameInput.value.trim()
            : "";


    const email =
        userEmailInput
            ? userEmailInput.value.trim()
            : "";


    /*
       Validate name.
    */

    if (!name) {

        alert(
            "Please enter your name."
        );

        if (userNameInput) {

            userNameInput.focus();

        }

        return;

    }


    /*
       Create user object.
    */

    const user = {

        name:
            name,

        email:
            email,

        loginAt:
            new Date().toISOString()

    };


    /*
       Save user.

       Even if localStorage fails,
       memoryUser keeps the session alive.
    */

    saveUser(user);


    /*
       Open application immediately.
    */

    showApplication(user);

}


/* =====================================================
   SHOW APPLICATION
===================================================== */

function showApplication(user) {

    if (!user) {
        return;
    }


    /*
       Hide login.
    */

    if (loginScreen) {

        loginScreen.style.display =
            "none";

    }


    /*
       Show application.
    */

    if (mainApp) {

        mainApp.style.display =
            "block";

    }


    /*
       Profile name.
    */

    if (profileName) {

        profileName.textContent =
            user.name;

    }


    /*
       Profile initial.
    */

    if (profileInitial) {

        profileInitial.textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    }


    /*
       Greeting.
    */

    updateGreeting(
        user.name
    );


    /*
       Load tasks.
    */

    loadTasks();

}


/* =====================================================
   DYNAMIC GREETING
===================================================== */

function updateGreeting(name) {

    if (!greeting) {
        return;
    }


    const currentHour =
        new Date().getHours();


    let greetingText;


    if (
        currentHour >= 5 &&
        currentHour < 12
    ) {

        greetingText =
            "Good morning";

    }

    else if (
        currentHour >= 12 &&
        currentHour < 17
    ) {

        greetingText =
            "Good afternoon";

    }

    else if (
        currentHour >= 17 &&
        currentHour < 21
    ) {

        greetingText =
            "Good evening";

    }

    else {

        greetingText =
            "Good night";

    }


    greeting.textContent =
        `${greetingText}, ${name}! 👋`;

}


/* =====================================================
   UPDATE GREETING EVERY MINUTE
===================================================== */

setInterval(
    () => {

        const user =
            getUser();


        if (
            user &&
            user.name
        ) {

            updateGreeting(
                user.name
            );

        }

    },
    60000
);


/* =====================================================
   INITIALIZE TASK EVENTS
===================================================== */

function initializeTaskEvents() {


    /* =================================================
       OPEN MODAL
    ================================================= */

    if (openTaskButton) {

        openTaskButton.addEventListener(
            "click",
            openTaskModal
        );

    }


    /* =================================================
       CLOSE MODAL
    ================================================= */

    if (closeTaskButton) {

        closeTaskButton.addEventListener(
            "click",
            closeTaskModal
        );

    }


    /* =================================================
       CLICK OUTSIDE MODAL
    ================================================= */

    if (taskModal) {

        taskModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    taskModal
                ) {

                    closeTaskModal();

                }

            }
        );

    }


    /* =================================================
       ESCAPE KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                taskModal &&
                taskModal.classList.contains("show")
            ) {

                closeTaskModal();

            }

        }
    );


    /* =================================================
       PRESETS
    ================================================= */

    presets.forEach(
        preset => {

            preset.addEventListener(
                "click",
                function () {

                    presets.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    preset.classList.add(
                        "active"
                    );


                    selectedDuration =
                        Number(
                            preset.dataset.duration
                        ) || 25;

                }
            );

        }
    );


    /* =================================================
       TASK FORM
    ================================================= */

    if (taskForm) {

        taskForm.addEventListener(
            "submit",
            createTask
        );

    }

}


/* =====================================================
   OPEN TASK MODAL
===================================================== */

function openTaskModal() {

    if (!taskModal) {
        return;
    }


    taskModal.classList.add(
        "show"
    );


    if (taskNameInput) {

        setTimeout(
            () => {

                taskNameInput.focus();

            },
            100
        );

    }

}


/* =====================================================
   CLOSE TASK MODAL
===================================================== */

function closeTaskModal() {

    if (!taskModal) {
        return;
    }


    taskModal.classList.remove(
        "show"
    );

}


/* =====================================================
   RESET TASK FORM
===================================================== */

function resetTaskForm() {

    if (taskForm) {

        taskForm.reset();

    }


    /*
       Reset duration.
    */

    selectedDuration =
        25;


    presets.forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    if (presets.length > 0) {

        presets[0].classList.add(
            "active"
        );

    }

}


/* =====================================================
   CREATE TASK
===================================================== */

function createTask(event) {

    event.preventDefault();


    if (
        !taskNameInput
    ) {

        return;

    }


    const name =
        taskNameInput.value.trim();


    const description =
        taskDescriptionInput
            ? taskDescriptionInput.value.trim()
            : "";


    /*
       Validate.
    */

    if (!name) {

        alert(
            "Please enter a task name."
        );

        taskNameInput.focus();

        return;

    }


    /*
       Create unique ID.

       Date.now + random number prevents
       accidental duplicate IDs.
    */

    const task = {

        id:
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}`,

        name:
            name,

        description:
            description ||
            "No description",

        duration:
            selectedDuration,

        sessions:
            0,

        completed:
            false,

        createdAt:
            new Date().toISOString()

    };


    /*
       Get existing tasks.
    */

    const tasks =
        getTasks();


    /*
       Add task.
    */

    tasks.push(task);


    /*
       Save.
    */

    saveTasks(tasks);


    /*
       Reset.
    */

    resetTaskForm();


    /*
       Close.
    */

    closeTaskModal();


    /*
       Refresh UI.
    */

    loadTasks();

}


/* =====================================================
   LOAD TASKS
===================================================== */

function loadTasks() {

    if (!taskList) {
        return;
    }


    const tasks =
        getTasks();


    /*
       Clear old cards.
    */

    taskList.innerHTML =
        "";


    /*
       EMPTY STATE
    */

    if (
        tasks.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }


        if (taskCount) {

            taskCount.textContent =
                "0 Tasks";

        }


        updateFocusTime(
            tasks
        );


        return;

    }


    /*
       Hide empty state.
    */

    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /*
       Task count.
    */

    if (taskCount) {

        taskCount.textContent =
            `${tasks.length} ${
                tasks.length === 1
                    ? "Task"
                    : "Tasks"
            }`;

    }


    /*
       Create cards.
    */

    tasks.forEach(
        task => {

            const card =
                createTaskCard(task);


            taskList.appendChild(
                card
            );

        }
    );


    /*
       Update focus time.
    */

    updateFocusTime(
        tasks
    );

}


/* =====================================================
   CREATE TASK CARD
===================================================== */

function createTaskCard(task) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "task-card";


    /*
       Progress.

       Current design:
       completed = 100%
       active = 0%
    */

    const progress =
        task.completed
            ? 100
            : 0;


    card.innerHTML = `

        <div class="task-top">

            <div
                class="task-checkbox ${
                    task.completed
                        ? "completed"
                        : ""
                }"
                data-id="${task.id}"
                role="button"
                tabindex="0"
                aria-label="${
                    task.completed
                        ? "Mark task incomplete"
                        : "Mark task complete"
                }"
            >

                ${
                    task.completed
                        ? '<i class="fa-solid fa-check"></i>'
                        : ""
                }

            </div>


            <div class="task-content">

                <h3
                    class="${
                        task.completed
                            ? "completed"
                            : ""
                    }"
                >
                    ${escapeHTML(task.name)}
                </h3>


                <p>
                    ${escapeHTML(
                        task.description
                    )}
                </p>

            </div>


            <button
                class="task-menu"
                data-delete="${task.id}"
                title="Delete task"
                aria-label="Delete task"
            >

                <i
                    class="fa-solid fa-ellipsis-vertical">
                </i>

            </button>

        </div>


        <div class="task-meta">

            <span>

                <i
                    class="fa-regular fa-clock">
                </i>

                ${Number(task.sessions) || 0}
                ${
                    Number(task.sessions) === 1
                        ? "Session"
                        : "Sessions"
                }

            </span>


            <span>

                <i
                    class="fa-regular fa-hourglass">
                </i>

                ${Number(task.duration) || 25}
                min

            </span>


            <span>

                <i
                    class="fa-solid fa-leaf">
                </i>

                Focus

            </span>

        </div>


        <div class="task-progress">

            <span
                class="progress-fill"
                data-progress="${progress}"
                style="width: ${progress}%"
            >
            </span>

        </div>


        <div class="task-actions">

            <button
                class="start-focus-btn"
                data-focus="${task.id}"
                ${
                    task.completed
                        ? "disabled"
                        : ""
                }
            >

                <i
                    class="fa-solid ${
                        task.completed
                            ? "fa-check"
                            : "fa-play"
                    }">
                </i>

                ${
                    task.completed
                        ? "Completed"
                        : "Start Focus"
                }

            </button>

        </div>

    `;


    /* =================================================
       COMPLETE
    ================================================= */

    const checkbox =
        card.querySelector(
            ".task-checkbox"
        );


    if (checkbox) {

        checkbox.addEventListener(
            "click",
            () => {

                toggleTask(
                    task.id
                );

            }
        );


        /*
           Keyboard accessibility.
        */

        checkbox.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleTask(
                        task.id
                    );

                }

            }
        );

    }


    /* =================================================
       DELETE
    ================================================= */

    const deleteButton =
        card.querySelector(
            ".task-menu"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteTask(
                    task.id
                );

            }
        );

    }


    /* =================================================
       START FOCUS
    ================================================= */

    const startFocusButton =
        card.querySelector(
            ".start-focus-btn"
        );


    if (
        startFocusButton &&
        !task.completed
    ) {

        startFocusButton.addEventListener(
            "click",
            () => {

                startFocusSession(
                    task.id
                );

            }
        );

    }


    return card;

}


/* =====================================================
   START FOCUS SESSION
===================================================== */

function startFocusSession(taskId) {

    const tasks =
        getTasks();


    const selectedTask =
        tasks.find(
            task =>
                String(task.id) ===
                String(taskId)
        );


    if (!selectedTask) {

        alert(
            "Task could not be found."
        );

        return;

    }


    if (selectedTask.completed) {

        alert(
            "This task is already completed."
        );

        return;

    }


    /*
       Store current task.
    */

    memoryCurrentTask =
        selectedTask;


    setStorage(
        "focusnestCurrentTask",
        selectedTask
    );


    /*
       Open focus session.

       IMPORTANT:
       Make sure focus-session.html
       exists in the same folder.
    */

    window.location.href =
        "../structure/focus-session.html";

}


/* =====================================================
   GET CURRENT TASK
===================================================== */

function getCurrentTask() {

    const storedTask =
        getStorage(
            "focusnestCurrentTask",
            null
        );


    if (storedTask) {

        memoryCurrentTask =
            storedTask;

        return storedTask;

    }


    return memoryCurrentTask;

}


/* =====================================================
   COMPLETE / TOGGLE TASK
===================================================== */

function toggleTask(id) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    /*
       Toggle.
    */

    task.completed =
        !task.completed;


    /*
       Save.
    */

    saveTasks(
        tasks
    );


    /*
       Refresh.
    */

    loadTasks();

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Delete this task?"
        );


    if (!confirmed) {

        return;

    }


    let tasks =
        getTasks();


    /*
       Remove task.
    */

    tasks =
        tasks.filter(
            task =>
                String(task.id) !==
                String(id)
        );


    /*
       Save.
    */

    saveTasks(
        tasks
    );


    /*
       Check current focus task.
    */

    const currentTask =
        getCurrentTask();


    if (
        currentTask &&
        String(currentTask.id) ===
        String(id)
    ) {

        memoryCurrentTask =
            null;


        removeStorage(
            "focusnestCurrentTask"
        );

    }


    /*
       Refresh.
    */

    loadTasks();

}


/* =====================================================
   TODAY'S FOCUS
===================================================== */

function updateFocusTime(tasks) {

    if (!focusTime) {
        return;
    }


    let totalMinutes =
        0;


    tasks.forEach(
        task => {

            /*
               Count completed task duration.
            */

            if (
                task.completed
            ) {

                totalMinutes +=
                    Number(
                        task.duration
                    ) || 0;

            }

        }
    );


    const hours =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes % 60;


    focusTime.textContent =
        `${hours}h ${
            String(minutes)
                .padStart(2, "0")
        }m`;

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* =====================================================
   LOGOUT
===================================================== */

/*
   You can connect this function to your
   logout button later.

   Example:

   logoutButton.addEventListener(
       "click",
       logoutUser
   );
*/

function logoutUser() {

    memoryUser =
        null;


    /*
       Remove only login information.

       Tasks are intentionally NOT deleted.
    */

    removeStorage(
        "focusnestUser"
    );


    if (mainApp) {

        mainApp.style.display =
            "none";

    }


    if (loginScreen) {

        loginScreen.style.display =
            "flex";

    }


    /*
       Reset login form.
    */

    if (loginForm) {

        loginForm.reset();

    }

}


/* =====================================================
   DEBUG HELPERS
===================================================== */

/*
   Open browser console and type:

   FocusNest.getTasks()

   or

   FocusNest.getUser()

   Useful while developing.
*/

window.FocusNest = {

    getTasks:
        getTasks,

    getUser:
        getUser,

    getCurrentTask:
        getCurrentTask,

    loadTasks:
        loadTasks,

    logout:
        logoutUser

};

