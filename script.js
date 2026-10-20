console.log("Study Planner is working!");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];


// ===============================
// ADD A NEW STUDY TASK
// ===============================

function addTask() {

    let subject = document.getElementById("subject").value;
    let topic = document.getElementById("topic").value;
    let examDate = document.getElementById("examDate").value;
    let priority = document.getElementById("priority").value;

    // Check empty fields
    if (subject === "" || topic === "" || examDate === "") {
        alert("Please fill in all the details.");
        return;
    }

    // Get today's date
    let today = new Date();

    let todayString =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    // Prevent past exam dates
    if (examDate < todayString) {
        alert("Please select today or a future exam date.");
        return;
    }

    // Create a unique ID
    let taskId = Date.now();

    // Add task to the tasks array
    tasks.push({
        id: taskId,
        subject: subject,
        topic: topic,
        examDate: examDate,
        priority: priority,
        completed: false
    });

    // Save tasks in Local Storage
    localStorage.setItem("studyTasks", JSON.stringify(tasks));

    // Create task on the webpage
    let taskList = document.getElementById("taskList");

    let newTask = document.createElement("li");

    newTask.setAttribute("data-id", taskId);

    // Calculate days remaining
    let todayDate = new Date();
    let exam = new Date(examDate);

    let timeDifference = exam - todayDate;

    let daysRemaining = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
    );

    newTask.innerHTML =
        "<strong>📚 " + subject + "</strong>" +
        "<br>📖 Topic: " + topic +
        "<br>📅 Exam Date: " + examDate +
        "<br>⏳ Days Remaining: " + daysRemaining +
        "<br>⭐ Priority: " + priority +
        "<br><br>" +
        "<button class='complete-btn' onclick='completeTask(this)'>Complete</button>" +
        "<button class='delete-btn' onclick='deleteTask(this)'>Delete</button>";

    taskList.appendChild(newTask);

    // Clear input fields
    document.getElementById("subject").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("examDate").value = "";

    // Update project sections
    updateProgress();
    generateRecommendation();
    generateSchedule();
}

// ===============================
// COMPLETE A TASK
// ===============================

function completeTask(button) {

    let taskElement = button.parentElement;

    taskElement.style.textDecoration = "line-through";

    let taskId = Number(taskElement.getAttribute("data-id"));

    let taskIndex = tasks.findIndex(function(task) {
        return task.id === taskId;
    });

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
    }

    localStorage.setItem("studyTasks", JSON.stringify(tasks));

updateProgress();

generateRecommendation();

generateSchedule();

    generateRecommendation();

    generateSchedule();
}


// ===============================
// DELETE A TASK
// ===============================

function deleteTask(button) {

    let taskElement = button.parentElement;

    let taskId = Number(taskElement.getAttribute("data-id"));

    let taskIndex = tasks.findIndex(function(task) {
        return task.id === taskId;
    });

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    }

    localStorage.setItem("studyTasks", JSON.stringify(tasks));

    taskElement.remove();

    updateProgress();

    generateRecommendation();

    generateSchedule();
}


// ===============================
// UPDATE PROGRESS
// ===============================

function updateProgress() {

    let taskElements = document.querySelectorAll("#taskList li");

    let totalTasks = taskElements.length;

    let completedTasks = 0;

    taskElements.forEach(function(task) {

        if (task.style.textDecoration === "line-through") {
            completedTasks++;
        }

    });


    // Update old progress section

    document.getElementById("progressText").innerText =
        "Completed: " + completedTasks + " / " + totalTasks;


    // Calculate pending tasks

    let pendingTasks = totalTasks - completedTasks;


    // Calculate completion percentage

    let completionPercentage = 0;

    if (totalTasks > 0) {
        completionPercentage =
            Math.round((completedTasks / totalTasks) * 100);
    }


    // Update dashboard

    document.getElementById("totalTasks").innerText =
        totalTasks;

    document.getElementById("pendingTasks").innerText =
        pendingTasks;

    document.getElementById("completedTasks").innerText =
        completedTasks;

    document.getElementById("completionPercentage").innerText =
        completionPercentage + "%";
      document.getElementById("progressBar").style.width =
    completionPercentage + "%";  
}


// ===============================
// LOAD SAVED TASKS
// ===============================

function loadTasks() {

    tasks.forEach(function(task) {

        if (!task.id) {
            task.id = Date.now() + Math.random();
        }

        let taskList = document.getElementById("taskList");

        let newTask = document.createElement("li");
        newTask.setAttribute("data-id", task.id);

        let today = new Date();
        let exam = new Date(task.examDate);

        let timeDifference = exam - today;

        let daysRemaining = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        let recommendation = "";

        if (daysRemaining <= 3) {
            recommendation = "🔴 Urgent! Focus on this topic today.";
        } else if (daysRemaining <= 7) {
            recommendation = "🟡 Start revising this topic regularly.";
        } else {
            recommendation = "🟢 You have enough time. Study this topic gradually.";
        }

        newTask.innerHTML =
            "<strong>" + task.subject + "</strong>" +
            "<br><span>📖 Topic: " + task.topic + "</span>" +
            "<br><span>📅 Exam Date: " + task.examDate + "</span>" +
            "<br><span>⏳ Days Remaining: " + daysRemaining + "</span>" +
            "<br><span>⭐ Priority: </span><span style=\"color: " +
            (task.priority === "High" ? "red" :
            task.priority === "Medium" ? "orange" : "green") +
            "; font-weight: bold;\">" + task.priority + "</span>" +
            "<br><span>" + recommendation + "</span>" +
            "<br><button class=\"complete-btn\" onclick=\"completeTask(this)\">Complete</button>" +
            "<button class=\"delete-btn\" onclick=\"deleteTask(this)\">Delete</button>";

        taskList.appendChild(newTask);


        // Show completed tasks as crossed out
        if (task.completed === true) {
            newTask.style.textDecoration = "line-through";
        }

    });

    localStorage.setItem("studyTasks", JSON.stringify(tasks));

updateProgress();
}


// Load saved tasks when the website opens
loadTasks();
function generateRecommendation() {

    let recommendationBox =
        document.getElementById("recommendationBox");

    if (tasks.length === 0) {
        recommendationBox.innerText =
            "Add some study tasks to get a recommendation.";
        return;
    }

    let pendingTasks = tasks.filter(function(task) {
        return task.completed !== true;
    });

    if (pendingTasks.length === 0) {
        recommendationBox.innerText =
            "🎉 Great job! You have completed all your study tasks.";
        return;
    }

    let bestTask = null;
    let highestScore = -1;

    pendingTasks.forEach(function(task) {

        let today = new Date();
        let exam = new Date(task.examDate);

        let timeDifference = exam - today;

        let daysRemaining = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        let score = 0;


        // Score based on days remaining
// Exam urgency has the highest importance

if (daysRemaining <= 2) {
    score = score + 20;
} else if (daysRemaining <= 3) {
    score = score + 15;
} else if (daysRemaining <= 5) {
    score = score + 10;
} else if (daysRemaining <= 7) {
    score = score + 6;
} else {
    score = score + 2;
}


        // Score based on priority

        if (task.priority === "High") {
            score = score + 5;
        } else if (task.priority === "Medium") {
            score = score + 3;
        } else {
            score = score + 1;
        }


        // Check whether this is the most urgent task

        if (score > highestScore) {
            highestScore = score;
            bestTask = task;
        }

    });


    // Calculate days remaining for recommended task

    let today = new Date();
    let exam = new Date(bestTask.examDate);

    let timeDifference = exam - today;

    let daysRemaining = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
    );


    // Display recommendation

    let reason = "";

if (daysRemaining <= 2 && bestTask.priority === "High") {
    reason = "Your exam is very close and this task has high priority.";
} else if (daysRemaining <= 2) {
    reason = "Your exam is very close, so this task needs immediate attention.";
} else if (bestTask.priority === "High") {
    reason = "This task has high priority and should be given more study time.";
} else if (daysRemaining <= 5) {
    reason = "Your exam is approaching, so regular revision is recommended.";
} else {
    reason = "This task currently has the highest urgency among your pending tasks.";
}

recommendationBox.innerHTML =
    "🔥 <strong>Focus on: " +
    bestTask.subject + "</strong>" +
    "<br>📖 Topic: " +
    bestTask.topic +
    "<br>📅 Exam Date: " +
    bestTask.examDate +
    "<br>⏳ Days Remaining: " +
    daysRemaining +
    "<br>⭐ Priority: " +
    bestTask.priority +
    "<br>🧠 Urgency Score: " +
    highestScore +
    "<br>💡 <strong>Reason:</strong> " +
    reason;
}
generateRecommendation();
// ===============================
// GENERATE TODAY'S STUDY SCHEDULE
// ===============================

function generateSchedule() {

    let scheduleBox = document.getElementById("scheduleBox");

    if (tasks.length === 0) {
        scheduleBox.innerText =
            "Add some study tasks to generate your study schedule.";
        return;
    }

    let pendingTasks = tasks.filter(function(task) {
        return task.completed !== true;
    });

    if (pendingTasks.length === 0) {
        scheduleBox.innerText =
            "🎉 All your study tasks are completed!";
        return;
    }

    // Sort tasks according to urgency score

    pendingTasks.sort(function(a, b) {

        function calculateScore(task) {

            let today = new Date();
            let exam = new Date(task.examDate);

            let timeDifference = exam - today;

            let daysRemaining = Math.ceil(
                timeDifference / (1000 * 60 * 60 * 24)
            );

            let score = 0;

            // Exam urgency

            if (daysRemaining <= 2) {
                score = score + 20;
            } else if (daysRemaining <= 3) {
                score = score + 15;
            } else if (daysRemaining <= 5) {
                score = score + 10;
            } else if (daysRemaining <= 7) {
                score = score + 6;
            } else {
                score = score + 2;
            }

            // Priority

            if (task.priority === "High") {
                score = score + 5;
            } else if (task.priority === "Medium") {
                score = score + 3;
            } else {
                score = score + 1;
            }

            return score;
        }

        return calculateScore(b) - calculateScore(a);

    });


    // Create the schedule

    let scheduleHTML = "";

    pendingTasks.forEach(function(task, index) {

        let today = new Date();
        let exam = new Date(task.examDate);

        let timeDifference = exam - today;

        let daysRemaining = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        let position = index + 1;

        let focusLevel = "";

        if (daysRemaining <= 3) {
            focusLevel = "🔴 High Focus";
        } else if (daysRemaining <= 7) {
            focusLevel = "🟡 Medium Focus";
        } else {
            focusLevel = "🟢 Light Focus";
        }

        scheduleHTML =
            scheduleHTML +
            "<div class=\"schedule-item\">" +
            "<strong>" + position + ". " +
            task.subject + "</strong>" +
            "<br>📖 Topic: " + task.topic +
            "<br>⏳ " + daysRemaining + " days remaining" +
            "<br>⭐ Priority: " + task.priority +
            "<br>🎯 " + focusLevel +
            "</div>";

    });


    scheduleBox.innerHTML = scheduleHTML;
}


// Generate schedule when website opens
generateSchedule();