/* =====================================================
   FOCUSNEST SESSION CONTROLLER
===================================================== */


/* =====================================================
   SESSION STATE
===================================================== */

let currentMode = "focus";

let isRunning = true;

let focusDuration = 45 * 60;

let breakDuration = 10 * 60;

let timeLeft = focusDuration;

let breakTimeLeft = breakDuration;

let sessionNumber = 1;

let totalSessions = 4;

let distractions = 0;

let musicPlaying = false;

let timerInterval = null;

let focusSecondsCompleted = 0;

let breakSuggestionIndex = 0;

let currentTask = null;


/* =====================================================
   ELEMENTS
===================================================== */

const timerElement =
    document.getElementById("timer");

const breakTimerElement =
    document.getElementById("breakTimer");

const timerLabel =
    document.getElementById("timerLabel");

const pauseButton =
    document.getElementById("pauseBtn");

const app =
    document.getElementById("app");


/* =====================================================
   LOAD CURRENT TASK
===================================================== */

function loadCurrentTask() {

    const savedTask =
        localStorage.getItem(
            "focusnestCurrentTask"
        );


    /* -----------------------------------------------
       No selected task
    ------------------------------------------------ */

    if (!savedTask) {

        console.log(
            "No current task selected."
        );

        showNoCurrentTask();

        return;

    }


    try {

        currentTask =
            JSON.parse(savedTask);

    }

    catch (error) {

        console.error(
            "Unable to read current task.",
            error
        );

        showNoCurrentTask();

        return;

    }


    if (!currentTask) {

        showNoCurrentTask();

        return;

    }


    /* =================================================
       SET FOCUS DURATION FROM TASK
    ================================================= */

    if (
        currentTask.duration &&
        Number(currentTask.duration) > 0
    ) {

        focusDuration =
            Number(currentTask.duration) * 60;

        timeLeft =
            focusDuration;

    }


    /* =================================================
       UPDATE TASK TITLE
    ================================================= */

    const sessionTaskTitle =
        document.getElementById(
            "sessionTaskTitle"
        );


    if (sessionTaskTitle) {

        sessionTaskTitle.textContent =
            currentTask.name;

    }


    /* =================================================
       UPDATE CURRENT TASK TITLE
    ================================================= */

    const currentTaskTitle =
        document.getElementById(
            "currentTaskTitle"
        );


    if (currentTaskTitle) {

        currentTaskTitle.textContent =
            currentTask.name;

    }


    /* =================================================
       UPDATE DESCRIPTION
    ================================================= */

    const currentTaskDescription =
        document.getElementById(
            "currentTaskDescription"
        );


    if (currentTaskDescription) {

        currentTaskDescription.textContent =
            currentTask.description ||
            "No description";

    }


    /* =================================================
       UPDATE GOAL
    ================================================= */

    const focusGoal =
        document.getElementById(
            "focusGoal"
        );


    if (focusGoal) {

        focusGoal.textContent =
            currentTask.name;

    }


    /* =================================================
       UPDATE MODAL TITLE
    ================================================= */

    const subtitle =
        document.getElementById(
            "sessionTaskSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            currentTask.description ||
            "Current selected task";

    }


    /* =================================================
       UPDATE TIMER
    ================================================= */

    updateTimer();

}


/* =====================================================
   NO CURRENT TASK
===================================================== */

function showNoCurrentTask() {

    const title =
        document.getElementById(
            "sessionTaskTitle"
        );


    const currentTitle =
        document.getElementById(
            "currentTaskTitle"
        );


    const description =
        document.getElementById(
            "currentTaskDescription"
        );


    if (title) {

        title.textContent =
            "No Task Selected";

    }


    if (currentTitle) {

        currentTitle.textContent =
            "No Task Selected";

    }


    if (description) {

        description.textContent =
            "Go back and select a task to begin.";

    }

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(timerInterval);


    timerInterval =
        setInterval(() => {

            if (!isRunning) {
                return;

            }


            if (
                currentMode === "focus"
            ) {

                if (timeLeft > 0) {

                    timeLeft--;

                    focusSecondsCompleted++;

                    updateTimer();

                }

                else {

                    completeFocusSession();

                }

            }

            else {

                if (breakTimeLeft > 0) {

                    breakTimeLeft--;

                    updateBreakTimer();

                }

                else {

                    completeBreak();

                }

            }

        }, 1000);

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

}


/* =====================================================
   UPDATE FOCUS TIMER
===================================================== */

function updateTimer() {

    if (!timerElement) {

        return;

    }


    timerElement.textContent =
        formatTime(timeLeft);


    const timerRing =
        document.getElementById(
            "timerRing"
        );


    if (!timerRing) {

        return;

    }


    const total =
        focusDuration || 1;


    const percentage =
        ((total - timeLeft) / total) * 100;


    timerRing.style.background =
        `conic-gradient(
            rgba(169,206,141,0.25) ${percentage}%,
            rgba(7,17,12,0.6) ${percentage}%
        )`;

}


/* =====================================================
   UPDATE BREAK TIMER
===================================================== */

function updateBreakTimer() {

    if (!breakTimerElement) {

        return;

    }


    breakTimerElement.textContent =
        formatTime(breakTimeLeft);

}


/* =====================================================
   PAUSE / RESUME
===================================================== */

function toggleTimer() {

    isRunning =
        !isRunning;
    if (!pauseButton) {
        return;
    }
    if (isRunning) {

        pauseButton.textContent =
            "❚❚";

        startTimer();

    }

    else {

        pauseButton.textContent =
            "▶";

        clearInterval(timerInterval);

    }

}


/* =====================================================
   SWITCH FOCUS / BREAK
===================================================== */

function switchMode(mode) {

    currentMode =
        mode;


    const focusTab =
        document.getElementById(
            "focusTab"
        );


    const breakTab =
        document.getElementById(
            "breakTab"
        );


    const timer =
        document.getElementById(
            "timer"
        );


    const timerRing =
        document.getElementById(
            "timerRing"
        );


    const breakPanel =
        document.getElementById(
            "breakPanel"
        );


    if (mode === "focus") {

        focusTab.classList.add(
            "active"
        );


        breakTab.classList.remove(
            "active"
        );


        timer.classList.remove(
            "hidden"
        );


        timerRing.classList.remove(
            "hidden"
        );


        breakPanel.classList.add(
            "hidden"
        );


        document.body.classList.remove(
            "break-mode"
        );


        timerLabel.textContent =
            "FOCUS";


        pauseButton.classList.remove(
            "hidden"
        );


        updateTimer();

    }

    else {

        breakTab.classList.add(
            "active"
        );


        focusTab.classList.remove(
            "active"
        );


        timerRing.classList.add(
            "hidden"
        );


        breakPanel.classList.remove(
            "hidden"
        );


        document.body.classList.add(
            "break-mode"
        );


        isRunning =
            true;


        breakTimeLeft =
            breakDuration;


        updateBreakTimer();

    }

}


/* =====================================================
   FOCUS COMPLETE
===================================================== */

function completeFocusSession() {

    clearInterval(
        timerInterval
    );


    isRunning =
        false;


    /* -----------------------------------------------
       Increase session count
    ------------------------------------------------ */

    if (currentTask) {

        updateTaskSessionCount();

    }


    /* -----------------------------------------------
       Update completion modal
    ------------------------------------------------ */

    const completionTime =
        document.querySelector(
            ".completion-time"
        );


    if (completionTime) {

        const minutes =
            Math.floor(
                focusSecondsCompleted / 60
            );


        completionTime.textContent =
            `${minutes} minutes focused`;

    }


    /* -----------------------------------------------
       Show modal
    ------------------------------------------------ */

    const modal =
        document.getElementById(
            "completeModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    /* -----------------------------------------------
       Sound
    ------------------------------------------------ */

    const sound =
        document.getElementById(
            "sessionSound"
        );


    if (
        sound &&
        sound.checked
    ) {

        playNotificationSound();

    }

}


/* =====================================================
   UPDATE TASK SESSION COUNT
===================================================== */

function updateTaskSessionCount() {

    if (!currentTask) {

        return;

    }


    let tasks =
        JSON.parse(
            localStorage.getItem(
                "focusnestTasks"
            )
        ) || [];


    const task =
        tasks.find(
            item =>
                Number(item.id) ===
                Number(currentTask.id)
        );


    if (!task) {

        return;

    }


    task.sessions =
        Number(task.sessions || 0) + 1;


    localStorage.setItem(
        "focusnestTasks",
        JSON.stringify(tasks)
    );


    /* Update current task too */

    currentTask.sessions =
        task.sessions;


    localStorage.setItem(
        "focusnestCurrentTask",
        JSON.stringify(currentTask)
    );

}


/* =====================================================
   START BREAK
===================================================== */

function startBreakFromComplete() {

    closeModal(
        "completeModal"
    );


    switchMode(
        "break"
    );


    isRunning =
        true;


    breakTimeLeft =
        breakDuration;


    updateBreakTimer();


    startTimer();

}


/* =====================================================
   BREAK COMPLETE
===================================================== */

function completeBreak() {

    sessionNumber++;


    if (
        sessionNumber >
        totalSessions
    ) {

        sessionNumber =
            totalSessions;


        alert(
            "🎉 You completed all your focus sessions!"
        );


        return;

    }


    const sessionText =
        document.getElementById(
            "sessionText"
        );


    if (sessionText) {

        sessionText.textContent =
            `Session ${sessionNumber} of ${totalSessions}`;

    }


    timeLeft =
        focusDuration;


    switchMode(
        "focus"
    );


    isRunning =
        true;


    updateTimer();


    updateSessionDots();


    const autoFocus =
        document.getElementById(
            "autoFocus"
        );


    if (
        autoFocus &&
        autoFocus.checked
    ) {

        startTimer();

    }

}


/* =====================================================
   SKIP BREAK
===================================================== */

function skipBreak() {

    breakTimeLeft =
        0;


    completeBreak();

}


/* =====================================================
   SESSION DOTS
===================================================== */

function updateSessionDots() {

    const dots =
        document.querySelectorAll(
            ".dot"
        );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index < sessionNumber
            );

        }
    );

}


/* =====================================================
   DISTRACTIONS
===================================================== */

function logDistraction() {

    distractions++;


    const distractionCount =
        document.getElementById(
            "distractionCount"
        );


    const statDistractions =
        document.getElementById(
            "statDistractions"
        );


    if (distractionCount) {

        distractionCount.textContent =
            distractions;

    }


    if (statDistractions) {

        statDistractions.textContent =
            distractions;

    }


    calculateFocusScore();

}


/* =====================================================
   TASK MODAL
===================================================== */

function openTasks() {

    renderSessionTasks();


    document
        .getElementById(
            "taskModal"
        )
        .classList.add(
            "active"
        );

}


/* =====================================================
   RENDER TASKS FROM FRONT PAGE
===================================================== */

function renderSessionTasks() {

    const taskList =
        document.getElementById(
            "sessionTaskList"
        );


    if (!taskList) {

        return;

    }


    const tasks =
        JSON.parse(
            localStorage.getItem(
                "focusnestTasks"
            )
        ) || [];


    taskList.innerHTML =
        "";


    /* No tasks */

    if (tasks.length === 0) {

        taskList.innerHTML = `

            <div class="no-session-tasks">

                <p>
                    No tasks have been created yet.
                </p>

            </div>

        `;

        updateTasks();

        return;

    }


    /* Create task items */

    tasks.forEach(task => {

        const label =
            document.createElement(
                "label"
            );


        label.className =
            "session-task-item";


        const checkbox =
            document.createElement(
                "input"
            );


        checkbox.type =
            "checkbox";


        checkbox.checked =
            Boolean(task.completed);


        checkbox.addEventListener(
            "change",
            () => {

                setTaskCompleted(
                    task.id,
                    checkbox.checked
                );

            }
        );


        const content =
            document.createElement(
                "span"
            );


        content.innerHTML = `

            <strong>
                ${escapeHTML(task.name)}
            </strong>

            <small>
                ${escapeHTML(
                    task.description ||
                    "No description"
                )}
            </small>

        `;


        label.appendChild(
            checkbox
        );


        label.appendChild(
            content
        );


        taskList.appendChild(
            label
        );

    });


    updateTasks();

}


/* =====================================================
   SET TASK COMPLETED
===================================================== */

function setTaskCompleted(
    taskId,
    completed
) {

    let tasks =
        JSON.parse(
            localStorage.getItem(
                "focusnestTasks"
            )
        ) || [];


    const task =
        tasks.find(
            item =>
                Number(item.id) ===
                Number(taskId)
        );


    if (!task) {

        return;

    }


    task.completed =
        completed;


    localStorage.setItem(
        "focusnestTasks",
        JSON.stringify(tasks)
    );


    /* If this is the current task,
       update currentTask too */

    if (
        currentTask &&
        Number(currentTask.id) ===
        Number(taskId)
    ) {

        currentTask.completed =
            completed;


        localStorage.setItem(
            "focusnestCurrentTask",
            JSON.stringify(
                currentTask
            )
        );

    }


    updateTasks();

}


/* =====================================================
   UPDATE TASK PROGRESS
===================================================== */

function updateTasks() {

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "focusnestTasks"
            )
        ) || [];


    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    let percentage =
        0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    const completedTasks =
        document.getElementById(
            "completedTasks"
        );


    const taskProgressText =
        document.getElementById(
            "taskProgressText"
        );


    const taskProgressPercent =
        document.getElementById(
            "taskProgressPercent"
        );


    const taskProgress =
        document.getElementById(
            "taskProgress"
        );


    const statTasks =
        document.getElementById(
            "statTasks"
        );


    if (completedTasks) {

        completedTasks.textContent =
            completed;

    }


    if (taskProgressText) {

        taskProgressText.textContent =
            `${completed} of ${total} tasks completed`;

    }


    if (taskProgressPercent) {

        taskProgressPercent.textContent =
            `${percentage}%`;

    }


    if (taskProgress) {

        taskProgress.style.width =
            `${percentage}%`;

    }


    if (statTasks) {

        statTasks.textContent =
            `${completed}/${total}`;

    }


    calculateFocusScore();

}


/* =====================================================
   NOTES
===================================================== */

function openNotes() {

    document
        .getElementById(
            "notesModal"
        )
        .classList.add(
            "active"
        );

}


function saveNote() {

    const note =
        document
            .getElementById(
                "quickNote"
            )
            .value
            .trim();


    if (!note) {

        alert(
            "Please write something first."
        );

        return;

    }


    localStorage.setItem(
        "focusnestNote",
        note
    );


    alert(
        "📝 Note saved!"
    );


    closeModal(
        "notesModal"
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function openStats() {

    calculateFocusScore();


    document
        .getElementById(
            "statsModal"
        )
        .classList.add(
            "active"
        );

}


function calculateFocusScore() {

    let score =
        100 -
        distractions * 4;


    score =
        Math.max(
            0,
            Math.min(
                100,
                score
            )
        );


    const focusScore =
        document.getElementById(
            "focusScore"
        );


    if (focusScore) {

        focusScore.textContent =
            `${score}%`;

    }


    const statFocus =
        document.getElementById(
            "statFocus"
        );


    if (statFocus) {

        const minutes =
            Math.floor(
                focusSecondsCompleted / 60
            );


        statFocus.textContent =
            `${minutes}m`;

    }

}


/* =====================================================
   ENVIRONMENT
===================================================== */

function openEnvironment() {

    document
        .getElementById(
            "environmentModal"
        )
        .classList.add(
            "active"
        );

}


function changeEnvironment(
    environment
) {

    const environments = {

        forest:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=90",

        rain:
        "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=90",

        library:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=90",

        fireplace:
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=2000&q=90",

        ocean:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90",

        cafe:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=90"

    };


    if (!environments[environment]) {

        return;

    }


    document.body.style.backgroundImage =
        `linear-gradient(
            rgba(5,13,10,0.45),
            rgba(5,13,10,0.72)
        ),
        url("${environments[environment]}")`;


    closeModal(
        "environmentModal"
    );

}


/* =====================================================
   MUSIC
===================================================== */

function openMusic() {

    document
        .getElementById(
            "musicModal"
        )
        .classList.add(
            "active"
        );

}


function selectMusic(song) {

    const musicName =
        document.querySelector(
            ".music-info strong"
        );


    if (musicName) {

        musicName.textContent =
            song;

    }


    closeModal(
        "musicModal"
    );


    if (!musicPlaying) {

        toggleMusic();

    }

}


function toggleMusic() {

    musicPlaying =
        !musicPlaying;


    const musicPlay =
        document.getElementById(
            "musicPlay"
        );


    if (musicPlay) {

        musicPlay.textContent =
            musicPlaying
            ? "❚❚"
            : "▶";

    }

}


function previousSong() {

    alert(
        "Previous track"
    );

}


function nextSong() {

    alert(
        "Next track"
    );

}


/* =====================================================
   BREAK ACTIVITIES
===================================================== */

const breakSuggestions = [

    "Rest your eyes for 20 seconds",

    "Drink some water",

    "Stretch your shoulders",

    "Take a short walk",

    "Take 5 deep breaths",

    "Look outside the window",

    "Relax your hands and wrists"

];


function nextBreakSuggestion() {

    breakSuggestionIndex++;


    if (
        breakSuggestionIndex >=
        breakSuggestions.length
    ) {

        breakSuggestionIndex =
            0;

    }


    const element =
        document.getElementById(
            "breakSuggestion"
        );


    if (element) {

        element.textContent =
            breakSuggestions[
                breakSuggestionIndex
            ];

    }

}


/* =====================================================
   BREATHING
===================================================== */

function startBreathing() {

    const modal =
        document.getElementById(
            "breathingModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    let breathingIn =
        true;


    const text =
        document.getElementById(
            "breathingText"
        );


    const breathingInterval =
        setInterval(
            () => {

                breathingIn =
                    !breathingIn;


                if (text) {

                    text.textContent =
                        breathingIn
                        ? "Breathe In"
                        : "Breathe Out";

                }

            },
            4000
        );


    modal.dataset.interval =
        breathingInterval;

}


/* =====================================================
   MODAL
===================================================== */

function closeModal(id) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    if (
        id === "breathingModal"
    ) {

        const interval =
            modal.dataset.interval;


        if (interval) {

            clearInterval(
                Number(interval)
            );

            modal.dataset.interval =
                "";

        }

    }

}


/* =====================================================
   MODAL OUTSIDE CLICK
===================================================== */

document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeModal(
                            overlay.id
                        );

                    }

                }
            );

        }
    );


/* =====================================================
   CUSTOMIZE
===================================================== */

function openCustomize() {

    document
        .getElementById(
            "customizeModal"
        )
        .classList.add(
            "active"
        );

}


function applySettings() {

    const focusInput =
        document.getElementById(
            "focusDuration"
        );


    const breakInput =
        document.getElementById(
            "breakDuration"
        );


    const focus =
        Number(
            focusInput.value
        );


    const breakTime =
        Number(
            breakInput.value
        );


    if (
        !focus ||
        !breakTime
    ) {

        return;

    }


    focusDuration =
        focus * 60;


    breakDuration =
        breakTime * 60;


    timeLeft =
        focusDuration;


    breakTimeLeft =
        breakDuration;


    updateTimer();

    updateBreakTimer();


    closeModal(
        "customizeModal"
    );

}


/* =====================================================
   EDIT GOAL
===================================================== */

function editGoal() {

    const goalElement =
        document.getElementById(
            "focusGoal"
        );


    const currentGoal =
        goalElement
        ? goalElement.textContent
        : "";


    const goal =
        prompt(
            "Enter your focus goal:",
            currentGoal
        );


    if (goal) {

        if (goalElement) {

            goalElement.textContent =
                goal;

        }

    }

}


/* =====================================================
   EDIT TASK
===================================================== */

function editTask() {

    if (!currentTask) {

        return;

    }


    const title =
        prompt(
            "Enter task name:",
            currentTask.name
        );


    if (!title) {

        return;

    }


    const newTitle =
        title.trim();


    if (!newTitle) {

        return;

    }


    /* -----------------------------------------------
       Update current task
    ------------------------------------------------ */

    currentTask.name =
        newTitle;


    localStorage.setItem(
        "focusnestCurrentTask",
        JSON.stringify(
            currentTask
        )
    );


    /* -----------------------------------------------
       Update main task list
    ------------------------------------------------ */

    let tasks =
        JSON.parse(
            localStorage.getItem(
                "focusnestTasks"
            )
        ) || [];


    const task =
        tasks.find(
            item =>
                Number(item.id) ===
                Number(currentTask.id)
        );


    if (task) {

        task.name =
            newTitle;

    }


    localStorage.setItem(
        "focusnestTasks",
        JSON.stringify(tasks)
    );


    /* -----------------------------------------------
       Update UI
    ------------------------------------------------ */

    const titleElement =
        document.getElementById(
            "sessionTaskTitle"
        );


    const currentTitle =
        document.getElementById(
            "currentTaskTitle"
        );


    if (titleElement) {

        titleElement.textContent =
            newTitle;

    }


    if (currentTitle) {

        currentTitle.textContent =
            newTitle;

    }

}


/* =====================================================
   FULLSCREEN
===================================================== */

function toggleFullscreen() {

    app.classList.toggle(
        "fullscreen"
    );


    const button =
        document.querySelector(
            ".bottom-actions button"
        );


    if (!button) {

        return;

    }


    if (
        app.classList.contains(
            "fullscreen"
        )
    ) {

        button.innerHTML =
            "⛶ <span>Exit Focus</span>";

    }

    else {

        button.innerHTML =
            "⛶ <span>Focus Mode</span>";

    }

}


/* =====================================================
   BACK TO TASKS
===================================================== */

function goBack() {

    clearInterval(
        timerInterval
    );


    /*
       Change this filename if your
       Task Page uses a different name.
    */

    window.location.href =
        "frontpg.html";

}


/* =====================================================
   NOTIFICATION SOUND
===================================================== */

function playNotificationSound() {

    try {

        const context =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.frequency.value =
            700;


        gain.gain.value =
            0.15;


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.25
        );

    }

    catch (error) {

        console.log(
            "Audio unavailable"
        );

    }

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


/* =====================================================
   INITIALIZE SESSION
===================================================== */

window.addEventListener(
    "load",
    () => {

        /* Load selected task */

        loadCurrentTask();


        /* Load saved note */

        const savedNote =
            localStorage.getItem(
                "focusnestNote"
            );


        const quickNote =
            document.getElementById(
                "quickNote"
            );


        if (
            savedNote &&
            quickNote
        ) {

            quickNote.value =
                savedNote;

        }


        /* Update timers */

        updateTimer();

        updateBreakTimer();


        /* Update task statistics */

        updateTasks();


        /* Update dots */

        updateSessionDots();


        /* Start timer */

        startTimer();

    }
);
function openEnvironment() {

    window.location.href =
        "../structure/environment.html";

}