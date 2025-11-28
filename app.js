// =============================
// FREEMIND APP BRAIN
// =============================

// Get elements
const goalInput = document.getElementById("goalInput");
const goalList = document.getElementById("goalList");
const saveBtn = document.getElementById("saveGoal");
const resetBtn = document.getElementById("resetDay");
const messageBox = document.getElementById("motivationMessage");
const streakDisplay = document.getElementById("streak");

// Data
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let streak = localStorage.getItem("streak") || 0;
let lastDate = localStorage.getItem("lastDate") || "";
// Daily Motivation Button (FreeMind)

const button = document.getElementById("dailyBtn");
const text = document.getElementById("dailyText");

const messages = [
  "You are stronger than the urge.",
  "One day at a time. You are winning.",
  "Freedom is built in small choices.",
  "Your break-through begins today.",
  "You were not created to be a slave.",
  "This moment does not control you.",
  "You are healing more than you know.",
  "Choose discipline. Choose life.",
  "The chains are breaking right now.",
  "Proud of you for showing up today."
];

button.addEventListener("click", () => {
  const random = Math.floor(Math.random() * messages.length);
  text.textContent = messages[random];
});
// Motivational messages
const messages = [
  "You are stronger than your urges.",
  "Today is another victory. Keep going.",
  "Your mind is being renewed daily.",
  "Self-control is real power.",
  "Your best life starts with discipline.",
  "You are breaking chains, never go back.",
  "Freedom feels better than regret.",
  "God is giving you strength.",
  "You are winning, one day at a time.",
  "I am proud of you for continuing."
];

// On load
displayGoals();
displayMessage();
checkStreak();

// Save goal
saveBtn.addEventListener("click", () => {
  if (goalInput.value.trim() !== "") {
    goals.push(goalInput.value);
    localStorage.setItem("goals", JSON.stringify(goals));
    goalInput.value = "";
    displayGoals();
  }
});

// Reset day
resetBtn.addEventListener("click", () => {
  let today = new Date().toDateString();

  if (today !== lastDate) {
    streak++;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDate", today);
  }

  dailyMessage();
  displayStreak();
});

// Show goals
function displayGoals() {
  goalList.innerHTML = "";
  goals.forEach((goal, index) => {
    let li = document.createElement("li");
    li.textContent = goal;
    goalList.appendChild(li);
  });
}

// Motivation message
function dailyMessage() {
  let random = Math.floor(Math.random() * messages.length);
  messageBox.textContent = messages[random];
}

// Display message on load
function displayMessage() {
  dailyMessage();
}

// Display streak
function displayStreak() {
  streakDisplay.textContent = streak + " day(s) strong 💪";
}

// Check streak each load
function checkStreak() {
  let today = new Date().toDateString();

  if (today !== lastDate) {
    displayStreak();
  } else {
    displayStreak();
  }
}

// First load streak show
displayStreak();