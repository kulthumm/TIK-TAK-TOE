window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-screen");
  const howToPlay = document.getElementById("how-to-play-screen");
  const battleMode = document.getElementById("battle-mode-screen");
  const avatarSelect = document.getElementById("avatar-select");
  const revealScreen = document.getElementById("warrior-reveal-screen");
  const revealImage = document.getElementById("reveal-image");
  const revealName = document.getElementById("reveal-name");
  const revealStrength = document.getElementById("reveal-strength");
  const revealIcon = document.getElementById("reveal-icon");
  const revealPower = document.getElementById("reveal-power");
  const proceedBtn = document.getElementById("proceed-to-battle");

  let currentPlayer = 1;
  let currentTurn = 1;
  let gameActive = true;
  let gameMode = "pvp";
  let moveCount = 0;
  const playerSelections = { 1: null, 2: null };

  setTimeout(() => {
    intro.classList.add("opacity-0", "transition-opacity", "duration-1000");
    setTimeout(() => {
      intro.classList.add("hidden");
      howToPlay.classList.remove("hidden");
    }, 1000);
  }, 6000);

  document.getElementById("enter-arena").addEventListener("click", () => {
    howToPlay.classList.add("hidden");
    battleMode.classList.remove("hidden");
  });

  document.getElementById("mode-pvp").addEventListener("click", () => {
    gameMode = "pvp";
    battleMode.classList.add("hidden");
    avatarSelect.classList.remove("hidden");
    currentPlayer = 1;
  });

  document.getElementById("mode-pvc").addEventListener("click", () => {
    gameMode = "pvc";
    battleMode.classList.add("hidden");
    avatarSelect.classList.remove("hidden");
    currentPlayer = 1;
  });

  const warriors = {
    "Shadow Claw": {
      image: "assets/chicken.png",
      strength: "Small but swift — master of feints",
      charm: { icon: "🏹", power: "The Bow of Illusions: Confuses the enemy with unpredictable patterns." }
    },
    "Windstep": {
      image: "assets/deer.png",
      strength: "Agile and silent, moves like air",
      charm: { icon: "🍃", power: "The Wind Charm: Grants speed and evasion on the battlefield." }
    },
    "Iron Fang": {
      image: "assets/dog.png",
      strength: "Loyal and fierce in close combat",
      charm: { icon: "🛡", power: "The Iron Crest: Increases defense during tactical standoffs." }
    },
    "Stormkick": {
      image: "assets/kangaroo.png",
      strength: "Power strikes with unmatched balance",
      charm: { icon: "⚡", power: "The Thunder Seal: Unleashes explosive attacks on corners of the grid." }
    },
    "Golden Roar": {
      image: "assets/lion.png",
      strength: "Regal, fearless, and bold",
      charm: { icon: "🔥", power: "The Flame Emblem: Instills fear, forcing hesitation in opponents." }
    },
    "Nightfang": {
      image: "assets/wolf.png",
      strength: "Hunts in silence, strikes in packs",
      charm: { icon: "🌙", power: "The Moon Fang: Enhances strategy under pressure." }
    }
  };

  document.querySelectorAll(".select-warrior").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".bg-white");
      const name = card.querySelector("h2").innerText.trim();
      const warrior = warriors[name];
      if (!warrior) return alert("Error: Warrior not found.");

      playerSelections[currentPlayer] = { name, ...warrior };
      revealImage.src = warrior.image;
      revealName.innerText = name;
      revealStrength.innerText = warrior.strength;
      revealIcon.innerText = warrior.charm.icon;
      revealPower.innerText = warrior.charm.power;

      avatarSelect.classList.add("hidden");
      revealScreen.classList.remove("hidden");

      // 🧊 Add particle effect ONLY when reveal screen is shown
      if (!window.particlesInitialized) {
        particlesJS("particles-js", {
          particles: {
            number: { value: 60 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.6 },
            size: { value: 3 },
            move: { enable: true, speed: 1 }
          },
          interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: false }, onclick: { enable: false } }
          }
        });
        window.particlesInitialized = true;
      }

      if (window.confetti) confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    });
  });

  proceedBtn.addEventListener("click", () => {
    revealScreen.classList.add("hidden");

    if (gameMode === "pvc" && currentPlayer === 1) {
      const warriorNames = Object.keys(warriors);
      const randomName = warriorNames[Math.floor(Math.random() * warriorNames.length)];
      const compWarrior = warriors[randomName];
      playerSelections[2] = { name: randomName, ...compWarrior };
    }

    if (gameMode === "pvp" && currentPlayer === 1) {
      currentPlayer = 2;
      document.getElementById("avatar-select-title").innerText = "Player 2 — Choose Your Warrior!";
      avatarSelect.classList.remove("hidden");
    } else {
      document.getElementById("player1-avatar").src = playerSelections[1].image;
      document.getElementById("player2-avatar").src = playerSelections[2]?.image || "assets/computer.png";
      document.getElementById("player1-name").innerText = playerSelections[1].name;
      document.getElementById("player2-name").innerText = playerSelections[2]?.name || "The Machine";
      document.getElementById("showdown-screen").classList.remove("hidden");
    }
  });

  document.getElementById("begin-battle-btn").addEventListener("click", () => {
    document.getElementById("showdown-screen").classList.add("hidden");
    document.getElementById("prepare-for-battle-screen").classList.remove("hidden");
    document.getElementById("info-p1-name").innerText = playerSelections[1].name;
    document.getElementById("info-p1-icon").innerText = playerSelections[1].charm.icon;
    document.getElementById("info-p1-power").innerText = playerSelections[1].charm.power.split(":")[0];
    document.getElementById("info-p1-desc").innerText = playerSelections[1].charm.power.split(":")[1];
    document.getElementById("info-p2-name").innerText = playerSelections[2].name;
    document.getElementById("info-p2-icon").innerText = playerSelections[2].charm.icon;
    document.getElementById("info-p2-power").innerText = playerSelections[2].charm.power.split(":")[0];
    document.getElementById("info-p2-desc").innerText = playerSelections[2].charm.power.split(":")[1];
  });

  const tiles = document.querySelectorAll(".tile");

  function checkWinner() {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    return winPatterns.find(pattern => {
      const [a, b, c] = pattern;
      const valA = tiles[a].innerText.trim();
      const valB = tiles[b].innerText.trim();
      const valC = tiles[c].innerText.trim();
      return valA !== "" && valA === valB && valA === valC;
    });
  }

  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      if (!gameActive || tile.innerText !== "") return;
      const charmIcon = playerSelections[currentTurn].charm.icon;
      tile.innerText = charmIcon;
      moveCount++;

      if (moveCount >= 5) {
        const winPattern = checkWinner();
        if (winPattern) {
          gameActive = false;

          const winner = playerSelections[currentTurn];
          const isComputerWin = (gameMode === "pvc" && currentTurn === 2);

          let victoryMessage = "";

          if (isComputerWin) {
            victoryMessage = "The Machine has won this battle!";
          } else if (gameMode === "pvp") {
            victoryMessage = currentTurn === 1
              ? "Player 1’s warrior has won this battle!"
              : "Player 2’s warrior has won this battle!";
          } else {
            victoryMessage = "Your warrior has won this battle!";
          }

          document.querySelector("#victory-screen h1").innerText = victoryMessage;
          document.getElementById("victory-avatar").src = winner.image;
          document.getElementById("prepare-for-battle-screen").classList.add("hidden");
          document.getElementById("victory-screen").classList.remove("hidden");

          if (window.confetti) {
            confetti({ particleCount: 180, spread: 120, origin: { y: 0.6 } });
          }

          return;
        }
      }

      if (moveCount === 9) {
        gameActive = false;
        document.getElementById("prepare-for-battle-screen").classList.add("hidden");
        document.getElementById("tie-screen").classList.remove("hidden");
        if (window.confetti) confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        return;
      }

      if (gameMode === "pvc" && currentTurn === 1) {
        currentTurn = 2;
        setTimeout(() => {
          const emptyTiles = [...tiles].filter(t => t.innerText === "");
          if (!gameActive || emptyTiles.length === 0) return;
          const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
          randomTile.innerText = playerSelections[2].charm.icon;
          moveCount++;

          if (moveCount >= 5) {
            const winPattern = checkWinner();
            if (winPattern) {
              gameActive = false;
              const winnerAvatar = playerSelections[2].image;
              document.getElementById("prepare-for-battle-screen").classList.add("hidden");
              document.getElementById("victory-screen").classList.remove("hidden");
              document.getElementById("victory-avatar").src = winnerAvatar;
              document.querySelector("#victory-screen h1").innerText = "The machine has won this battle!";
              if (window.confetti) confetti({ particleCount: 180, spread: 120, origin: { y: 0.6 } });
              return;
            }
          }

          if (moveCount === 9) {
            gameActive = false;
            document.getElementById("prepare-for-battle-screen").classList.add("hidden");
            document.getElementById("tie-screen").classList.remove("hidden");
            if (window.confetti) confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            return;
          }

          currentTurn = 1;
        }, 700);
      } else {
        currentTurn = currentTurn === 1 ? 2 : 1;
      }
    });
  });

  document.getElementById("play-again-btn").addEventListener("click", () => {
    tiles.forEach(tile => tile.innerText = "");
    currentTurn = 1;
    moveCount = 0;
    gameActive = true;
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("prepare-for-battle-screen").classList.remove("hidden");
  });

  document.getElementById("play-again-from-tie").addEventListener("click", () => {
    tiles.forEach(tile => tile.innerText = "");
    currentTurn = 1;
    moveCount = 0;
    gameActive = true;
    document.getElementById("tie-screen").classList.add("hidden");
    document.getElementById("prepare-for-battle-screen").classList.remove("hidden");
  });
});
