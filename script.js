/* 
  EASY EDIT SECTION

  Passwords are encoded so students cannot read them instantly.
  To make your own password:
  1. Open browser console
  2. Type: btoa("yourpassword")
  3. Copy the result into encodedPassword

  Current passwords:
  library  = bGlicmFyeQ==
  gym      = Z3lt
  classroom = Y2xhc3Nyb29t
*/

const stages = [
  {
    title: "Stage 1 Unlock",
    encodedPassword: "bGlicmFyeQ==",
    lockNumber: "3",
    story: "A story fragment returns. The school remembers that helping others matters.",
    clue: "Go to the place where energy echoes, teamwork happens, and footsteps fill the room."
  },
  {
    title: "Stage 2 Unlock",
    encodedPassword: "Z3lt",
    lockNumber: "7",
    story: "Another fragment returns. The school remembers that action can change the ending.",
    clue: "Your next clue waits where learning begins, questions are asked, and ideas come alive."
  },
  {
    title: "Stage 3 Unlock",
    encodedPassword: "Y2xhc3Nyb29t",
    lockNumber: "1",
    story: "The final fragment returns. The story is almost whole again.",
    clue: "Go to the place where decisions are made and the final chest awaits."
  }
];

const finalCombination = stages.map(stage => stage.lockNumber).join("");

const stagesContainer = document.getElementById("stagesContainer");
const finalLockContainer = document.getElementById("finalLockContainer");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const percentText = document.getElementById("percentText");
const fragmentDots = document.getElementById("fragmentDots");
const flashOverlay = document.getElementById("flashOverlay");
const soundToggle = document.getElementById("soundToggle");

let progress = Number(localStorage.getItem("escapeStoryProgress")) || 0;
let finalUnlocked = localStorage.getItem("escapeFinalUnlocked") === "true";
let soundOn = false;

function scrollToStory() {
  document.getElementById("story").scrollIntoView({ behavior: "smooth" });
}

function decodePassword(encodedPassword) {
  return atob(encodedPassword).toLowerCase();
}

function renderStages() {
  stagesContainer.innerHTML = "";
  finalLockContainer.innerHTML = "";
  fragmentDots.innerHTML = "";

  const percent = Math.round((progress / stages.length) * 100);

  progressText.textContent = `Fragments restored: ${progress} / ${stages.length}`;
  progressFill.style.width = `${percent}%`;
  percentText.textContent = `${percent}%`;

  for (let dotIndex = 0; dotIndex < stages.length; dotIndex++) {
    const dot = document.createElement("div");
    dot.className = dotIndex < progress ? "fragment-dot restored" : "fragment-dot";
    fragmentDots.appendChild(dot);
  }

  for (let i = 0; i <= progress && i < stages.length; i++) {
    const stage = stages[i];
    const card = document.createElement("div");
    card.className = "stage-card";

    if (i < progress) {
      card.innerHTML = `
        <h2>✅ ${stage.title}</h2>
        <p class="success">Story fragment restored.</p>
        <p class="lock-number">Combination Number ${i + 1}: ${stage.lockNumber}</p>
        <p>${stage.story}</p>
        <p><strong>Next Clue:</strong> ${stage.clue}</p>
      `;
    } else {
      card.innerHTML = `
        <h2>🔒 ${stage.title}</h2>
        <p>Enter the password from your completed activity.</p>

        <input 
          id="password-${i}" 
          type="text" 
          placeholder="Enter password..." 
          autocomplete="off"
          onkeydown="handleEnter(event, ${i})"
        />

        <button onclick="checkPassword(${i})">Restore Fragment</button>

        <div id="message-${i}"></div>
      `;
    }

    stagesContainer.appendChild(card);
  }

  if (progress >= stages.length) {
    renderFinalLock();
  }
}

function renderFinalLock() {
  const card = document.createElement("div");
  card.className = "final-lock-card";

  if (finalUnlocked) {
    card.innerHTML = `
      <h2>🏆 Final Sequence Restored</h2>
      <p class="success">The story has been restored.</p>

      <div class="final-combo-display">
        ${finalCombination.split("").map(num => `<div class="combo-box">${num}</div>`).join("")}
      </div>

      <p>Take the restored combination to the final destination.</p>
      <p><strong>The Eraser has lost control of the story.</strong></p>
    `;
  } else {
    card.innerHTML = `
      <h2>🔐 Final Lock Screen</h2>
      <p>All fragments are restored. Enter the full combination to complete the system.</p>

      <input 
        id="finalComboInput" 
        type="text" 
        placeholder="Enter final combination..." 
        autocomplete="off"
        onkeydown="handleFinalEnter(event)"
      />

      <button onclick="checkFinalCombination()">Unlock Final Sequence</button>

      <div id="finalMessage"></div>
    `;
  }

  finalLockContainer.appendChild(card);
}

function handleEnter(event, index) {
  if (event.key === "Enter") {
    checkPassword(index);
  }
}

function handleFinalEnter(event) {
  if (event.key === "Enter") {
    checkFinalCombination();
  }
}

function checkPassword(index) {
  const input = document.getElementById(`password-${index}`);
  const message = document.getElementById(`message-${index}`);

  const enteredPassword = input.value.trim().toLowerCase();
  const correctPassword = decodePassword(stages[index].encodedPassword);

  if (enteredPassword === correctPassword) {
    progress = index + 1;
    localStorage.setItem("escapeStoryProgress", progress);

    playSuccessEffect();

    message.innerHTML = `
      <p class="success">Story fragment restored.</p>
      <p class="lock-number">Combination Number ${index + 1}: ${stages[index].lockNumber}</p>
      <p>${stages[index].story}</p>
      <p><strong>Next Clue:</strong> ${stages[index].clue}</p>
    `;

    setTimeout(renderStages, 1100);

  } else {
    playErrorEffect();
    message.innerHTML = `<p class="error">Access denied. The story remains incomplete.</p>`;
    input.classList.add("shake");

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  }
}

function checkFinalCombination() {
  const input = document.getElementById("finalComboInput");
  const message = document.getElementById("finalMessage");

  const enteredCombo = input.value.trim();

  if (enteredCombo === finalCombination) {
    finalUnlocked = true;
    localStorage.setItem("escapeFinalUnlocked", "true");

    playSuccessEffect();

    message.innerHTML = `
      <p class="success">Final sequence accepted. Story restored.</p>
    `;

    setTimeout(renderStages, 1000);
  } else {
    playErrorEffect();

    message.innerHTML = `
      <p class="error">Final lock rejected. The story is still unstable.</p>
    `;

    input.classList.add("shake");

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  }
}

function playSuccessEffect() {
  document.body.classList.add("success-flash");
  flashOverlay.classList.add("active");

  if (soundOn) {
    beep(660, 0.08);
    setTimeout(() => beep(880, 0.1), 120);
  }

  setTimeout(() => {
    document.body.classList.remove("success-flash");
    flashOverlay.classList.remove("active");
  }, 800);
}

function playErrorEffect() {
  document.body.classList.add("erased");

  if (soundOn) {
    beep(180, 0.12);
  }

  setTimeout(() => {
    document.body.classList.remove("erased");
  }, 450);
}

function toggleSound() {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "Sound: On" : "Sound: Off";

  if (soundOn) {
    beep(440, 0.08);
  }
}

function beep(frequency, duration) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function resetProgress() {
  localStorage.removeItem("escapeStoryProgress");
  localStorage.removeItem("escapeFinalUnlocked");

  progress = 0;
  finalUnlocked = false;

  renderStages();
}

renderStages();