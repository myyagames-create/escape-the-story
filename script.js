const clueTextStyle = `
  font-family: "Courier New", Courier, monospace;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 1.85;
  color: #f4fbff;
`;

const clueTitleStyle = `
  font-family: "Courier New", Courier, monospace;
  font-weight: 900;
  letter-spacing: 4px;
`;

const stages = [
  {
    title: "Stage 1 Unlock",
    keyId: "alpha",
    lockNumber: "36",
    story: `
      <strong>Part of the story fixed… sort of</strong><br><br>
      Okay… that helped a little.<br>
      But things are still out of order.<br><br>
      Now the story is skipping around:<br>
      The ending is happening before the middle.<br>
      The middle is happening before the beginning.<br>
      And some parts are just… missing.<br><br>
      Another message appears:<br>
      “You fixed ONE piece. There is a lot more.”
    `,
    clue: `
      Now find the place where energy grows,<br>
      Where movement matters and teamwork shows.<br>
      Feet move fast and hearts beat strong,<br>
      It’s where you go to run, jump, and belong.<br><br>
      Find this space to continue on.
    `
  },
  {
    title: "Stage 2 Unlock",
    keyId: "bravo",
    lockNumber: "34",
    story: `
      <strong>More of the story repaired…</strong><br><br>
      Now you can see the problem.<br>
      The story is not broken by accident—<br>
      it has been scrambled.<br><br>
      Events are in the wrong order.<br>
      Things are happening at the wrong time.<br><br>
      And if the story stays like this…<br>
      it will not make sense at all.<br><br>
      A new message appears:<br>
      “Stories only work when things happen in the right order… can you figure it out?”
    `,
    clue: `
      Now find the place where voices blend,<br>
      Where notes and rhythms twist and bend.<br>
      Drums may beat and singers rehearse,<br>
      Telling a story without a verse.<br><br>
      Head there next.
    `
  },
  {
    title: "Stage 3 Unlock",
    keyId: "charlie",
    lockNumber: "26",
    story: `
      <strong>Final parts loading…</strong><br><br>
      You are close.<br>
      The story is almost fixed.<br><br>
      But one problem remains…<br>
      Everything is still mixed up.<br><br>
      The only way to escape the story is to:<br>
      <strong>put things back in the right order.</strong><br><br>
      A final message appears:<br>
      “Fix the order… fix the story.”
    `,
    clue: ``
  }
];

const finalCombinationPieces = ["34", "36", "26"];

function terminalClueBox(clueText) {
  const clueLines = clueText
    .split("<br>")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<span class="clue-line" style="${clueTextStyle}">${line}</span>`)
    .join("");

  if (!clueLines) return "";

  return `
    <div class="next-clue-box">
      <span class="next-clue-title" style="${clueTitleStyle}">Next Clue</span>
      <p style="${clueTextStyle}">${clueLines}</p>
    </div>
  `;
}

const finalSuccessStory = `
  <div class="victory-screen">
    <div class="victory-particles">
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>

    <div class="victory-kicker">System Fully Restored</div>

    <h2 class="victory-title">Mission Complete</h2>

    <p class="victory-subtitle">The story is back online.</p>

    <div class="victory-combo-reveal">
      ${finalCombinationPieces.map(num => `<div class="victory-number">${num}</div>`).join("")}
    </div>

    <div class="lock-accepted">Lock Accepted</div>

    <div class="reward-grid">
      <div class="reward-tile">
        <span class="reward-icon">🧩</span>
        <strong>Order Restored</strong>
        <p>The scrambled pieces finally make sense.</p>
      </div>

      <div class="reward-tile">
        <span class="reward-icon">⚡</span>
        <strong>Story Repaired</strong>
        <p>The broken timeline has been fixed.</p>
      </div>

      <div class="reward-tile">
        <span class="reward-icon">🏆</span>
        <strong>Final Clue Unlocked</strong>
        <p>Your team has earned the last mission.</p>
      </div>
    </div>

    <div class="victory-story-file">
      <p class="success">STORY FIXED</p>

      <p>Everything snaps back into place.</p>
      <p>The bell rings at the right time.</p>
      <p>Classes happen in the right order.</p>
      <p>The day finally makes sense again.</p>

      <p>A final message appears:</p>
      <p class="quote">“Nice. You actually fixed it.”</p>

      <p><strong>You escaped the story!</strong></p>
    </div>

    <div class="final-mission-file">
      <h2 style="${clueTitleStyle} color: var(--gold);">FINAL CLUE UNLOCKED</h2>

      <p style="${clueTextStyle}">
        In order to truly win, you must find the lock,<br>
        The final step before you stop the clock.<br>
        Go to the place where visitors sign in,<br>
        Where calls are answered and messages begin.<br>
        Behind the desk at the front you’ll see,<br>
        The person who keeps things running smoothly.<br>
        Find them to finish your final task—<br>
        They hold the lock you need to crack.
      </p>

      <div class="secret-sentence" style="${clueTextStyle} color: var(--green); font-weight: 900; text-align: center;">
        Before they give it to you, say:<br><br>
        “The code is cracked, the story is back, now we are here to claim the snack!”
      </div>
    </div>
  </div>
`;

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

function getVaultValue(id) {
  const vault = {
    alpha: [[84, 69], [65, 77], [87, 79], [82, 75]],
    bravo: [[83, 69], [66, 65], [83, 84], [73, 65], [78]],
    charlie: [[66, 67], [77, 80], [82, 83], [84]],
    omega: [[51, 52], [51, 54], [50, 54]]
  };

  return vault[id]
    .flat()
    .map(code => String.fromCharCode(code))
    .join("")
    .toLowerCase();
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
        <p class="lock-number">The part repaired reveals number ${stage.lockNumber}.</p>
        <p>${stage.story}</p>
        ${terminalClueBox(stage.clue)}
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
    card.innerHTML = finalSuccessStory;
  } else {
    card.innerHTML = `
      <h2>🔐 Final Lock Screen</h2>
      <p>
        You now have all the numbers.<br>
        They are not in order.<br>
        Put them back together before the lock can be opened.
      </p>

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

function normalizeFinalCombination(value) {
  return value.replace(/\s+/g, "").replace(/-/g, "").trim().toLowerCase();
}

function checkPassword(index) {
  const input = document.getElementById(`password-${index}`);
  const message = document.getElementById(`message-${index}`);

  const enteredPassword = input.value.trim().toLowerCase();
  const correctPassword = getVaultValue(stages[index].keyId);

  if (enteredPassword === correctPassword) {
    progress = index + 1;
    localStorage.setItem("escapeStoryProgress", progress);

    playSuccessEffect();

    message.innerHTML = `
      <p class="success">Story fragment restored.</p>
      <p class="lock-number">The part repaired reveals number ${stages[index].lockNumber}.</p>
      <p>${stages[index].story}</p>
      ${terminalClueBox(stages[index].clue)}
    `;

    setTimeout(renderStages, 1100);

  } else {
    playErrorEffect();

    message.innerHTML = `
      <p class="error">Access denied. The story remains incomplete.</p>
    `;

    input.classList.add("shake");

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  }
}

function checkFinalCombination() {
  const input = document.getElementById("finalComboInput");
  const message = document.getElementById("finalMessage");

  const enteredCombo = normalizeFinalCombination(input.value);
  const correctCombo = getVaultValue("omega");

  if (enteredCombo === correctCombo) {
    finalUnlocked = true;
    localStorage.setItem("escapeFinalUnlocked", "true");

    playVictoryEffect();

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
  document.body.classList.add("system-glitch");
  flashOverlay.classList.add("active");

  if (soundOn) {
    beep(660, 0.08);
    setTimeout(() => beep(880, 0.1), 120);
  }

  setTimeout(() => {
    document.body.classList.remove("success-flash");
    document.body.classList.remove("system-glitch");
    flashOverlay.classList.remove("active");
  }, 800);
}

function playVictoryEffect() {
  document.body.classList.add("success-flash");
  document.body.classList.add("system-glitch");
  flashOverlay.classList.add("active");

  if (soundOn) {
    beep(523, 0.09);
    setTimeout(() => beep(659, 0.09), 120);
    setTimeout(() => beep(784, 0.12), 240);
    setTimeout(() => beep(1046, 0.18), 420);
  }

  setTimeout(() => {
    document.body.classList.remove("success-flash");
    document.body.classList.remove("system-glitch");
    flashOverlay.classList.remove("active");
  }, 900);
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