document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoList = document.getElementById("todo-list");
  const timerDisplay = document.getElementById("timer-display");
  const timerDurationInput = document.getElementById("timer-duration");
  const startTimerButton = document.getElementById("start-timer");
  const addSubjectBtn = document.getElementById("add-subject-btn");
  const newSubjectInput = document.getElementById("new-subject");
  const subjectSelect = document.getElementById("subject-select");
  const subsubjectSelect = document.getElementById("subsubject-select");

  let timerInterval = null;

  // Handle Todo form submission
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = document.getElementById("todo-input").value;
    const priority = document.getElementById("priority-select").value;
    const subject = subjectSelect.value;
    const subsubject = subsubjectSelect.value;

    const li = document.createElement("li");
    li.textContent = `${task} - Priority: ${priority} - Subject: ${subject}${
      subsubject ? " (" + subsubject + ")" : ""
    }`;
    todoList.appendChild(li);

    todoForm.reset();
  });

  // Add new subject manually and update both subject lists
  addSubjectBtn.addEventListener("click", () => {
    const newSubject = newSubjectInput.value.trim();
    if (newSubject === "") {
      alert("Please enter a valid subject.");
      return;
    }
    // Check for duplicates in subjectSelect
    const options = subjectSelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value.toLowerCase() === newSubject.toLowerCase()) {
        alert("Subject already exists.");
        newSubjectInput.value = "";
        return;
      }
    }
    const optionMain = document.createElement("option");
    optionMain.value = newSubject;
    optionMain.text = newSubject;
    subjectSelect.add(optionMain);

    // Automatically add to subsubjectSelect as well
    const optionSub = document.createElement("option");
    optionSub.value = newSubject;
    optionSub.text = newSubject;
    subsubjectSelect.add(optionSub);

    newSubjectInput.value = "";
  });

  // Timer functionality with siren-like sound for 10 seconds
  startTimerButton.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    let duration = parseInt(timerDurationInput.value) * 60;
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid duration (in minutes).");
      return;
    }

    updateTimerDisplay(duration);

    timerInterval = setInterval(() => {
      duration--;
      updateTimerDisplay(duration);
      if (duration <= 0) {
        clearInterval(timerInterval);
        playSirenForTenSeconds();
      }
    }, 1000);
  });

  function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Function to play a siren-like sound for 10 seconds using modulated frequency
  function playSirenForTenSeconds() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.start();
    const startTime = audioCtx.currentTime;
    const duration = 10; // 10 seconds

    // Update the oscillator frequency every 50ms to create a siren effect
    const sirenInterval = setInterval(() => {
      const elapsed = audioCtx.currentTime - startTime;
      // Frequency oscillates between 600Hz and 1200Hz to simulate a siren sound
      const modFreq = 600 + 600 * Math.abs(Math.sin(Math.PI * elapsed));
      oscillator.frequency.setValueAtTime(modFreq, audioCtx.currentTime);
      if (elapsed >= duration) {
        clearInterval(sirenInterval);
        oscillator.stop();
      }
    }, 50);
  }
});
