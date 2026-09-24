"use strict";

class Game {
  constructor() {
    this.playerName = "";
    this.lives = 3;
    this.score = 0;
    this.currentLevel = 1;
    this.levelAttempts = 0;

    this.startScreen = document.querySelector("#start-screen");
    this.gameArea = document.querySelector("#game-area");
    this.startForm = document.querySelector("#start-form");
    this.playerNameInput = document.querySelector("#player-name");
    this.hudPlayer = document.querySelector("#hud-player");
    this.hudLives = document.querySelector("#hud-lives");
    this.hudLevel = document.querySelector("#hud-level");
    this.hudScore = document.querySelector("#hud-score");
    this.gameConsole = document.querySelector(".game-console");

    this.bindEvents();
    this.restorePlayerName();
  }

  bindEvents() {
    this.startForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.startGame();
    });
  }

  restorePlayerName() {
    const savedName = localStorage.getItem("error404-player-name");

    if (savedName) {
      this.playerNameInput.value = savedName;
    }
  }

  startGame() {
    const enteredName = this.playerNameInput.value.trim();

    if (!enteredName) {
      this.playerNameInput.focus();
      return;
    }

    this.playerName = enteredName;
    localStorage.setItem("error404-player-name", this.playerName);
    this.updateHud();
    this.startScreen.hidden = true;
    this.gameArea.hidden = false;
    this.loadLevel(1);
  }

  updateHud() {
    this.hudPlayer.textContent = this.playerName;
    this.hudLives.textContent = String(this.lives);
    this.hudLevel.textContent = String(this.currentLevel);
    this.hudScore.textContent = String(this.score);
  }

  loadLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.levelAttempts = 0;
    this.updateHud();

    if (levelNumber === 1) {
      this.renderLockedDoorLevel();
      return;
    }

    this.renderTemporaryLevelMessage(`Nivel ${levelNumber} preparado. Próximamente...`);
    console.log(`Loading level ${levelNumber}`);
  }

  renderLockedDoorLevel() {
    this.gameConsole.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "🔒 PUERTA BLOQUEADA";

    const instruction = document.createElement("p");
    instruction.textContent = "Introduce el código secreto:";

    const hint = document.createElement("p");
    hint.className = "level-hint";
    hint.textContent = "PISTA: el año en curso abre la puerta.";

    const form = document.createElement("form");
    form.className = "level-form";

    const inputRow = document.createElement("div");
    inputRow.className = "level-input-row";

    const prompt = document.createElement("span");
    prompt.textContent = ">";
    prompt.setAttribute("aria-hidden", "true");

    const input = document.createElement("input");
    input.id = "secret-code";
    input.name = "secretCode";
    input.type = "text";
    input.inputMode = "numeric";
    input.maxLength = 4;
    input.autocomplete = "off";
    input.placeholder = "_ _ _ _";
    input.required = true;
    input.autofocus = true;
    input.setAttribute("aria-label", "Código secreto");

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "DESBLOQUEAR";

    const feedback = document.createElement("p");
    feedback.id = "level-feedback";
    feedback.className = "level-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    inputRow.append(prompt, input);
    form.append(inputRow, button, feedback);
    this.gameConsole.append(title, instruction, hint, form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.checkSecretCode(input, button, feedback);
    });

    input.focus();
  }

  checkSecretCode(input, button, feedback) {
    if (input.value === "2026") {
      feedback.textContent = "✅ PUERTA ABIERTA";
      feedback.className = "level-feedback success";
      input.disabled = true;
      button.disabled = true;
      this.currentLevel = 2;
      this.updateHud();
      console.log("Nivel 1 completado. Avanzando al nivel 2.");
      return;
    }

    this.levelAttempts += 1;
    this.lives = Math.max(0, this.lives - 1);
    this.updateHud();
    input.value = "";

    if (this.levelAttempts >= 3) {
      feedback.textContent = "SISTEMA BLOQUEADO";
      feedback.className = "level-feedback error";
      input.disabled = true;
      button.disabled = true;
      return;
    }

    feedback.textContent = "❌ ACCESO DENEGADO";
    feedback.className = "level-feedback error";
    input.focus();
  }

  renderTemporaryLevelMessage(message) {
    this.gameConsole.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "MISIÓN EN ESPERA";

    const levelMessage = document.createElement("p");
    levelMessage.textContent = message;

    this.gameConsole.append(title, levelMessage);
  }
}

const game = new Game();

function startGame() {
  game.startGame();
}

function loadLevel(levelNumber) {
  game.loadLevel(levelNumber);
}

window.startGame = startGame;
window.loadLevel = loadLevel;
