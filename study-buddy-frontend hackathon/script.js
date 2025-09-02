const notesInput = document.getElementById("notesInput");
const generateBtn = document.getElementById("generateBtn");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const statusDiv = document.getElementById("status");

const container = document.getElementById("flashcardsContainer");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");

let flashcards = [];
let currentIndex = 0;

// ---------------------------
// Create Flashcard DOM
// ---------------------------
function createFlashcard(card) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "flashcard";

  const inner = document.createElement("div");
  inner.className = "flashcard-inner";

  const front = document.createElement("div");
  front.className = "flashcard-front";
  front.textContent = card.front;

  const back = document.createElement("div");
  back.className = "flashcard-back";
  back.textContent = card.back;

  inner.appendChild(front);
  inner.appendChild(back);
  cardDiv.appendChild(inner);

  cardDiv.addEventListener("click", () => {
    inner.classList.toggle("flipped");
  });

  return cardDiv;
}

// ---------------------------
// Render flashcard by index
// ---------------------------
function showFlashcard(index) {
  container.innerHTML = "";
  if (flashcards.length === 0) {
    progress.textContent = "0 / 0";
    return;
  }

  const card = flashcards[index];
  const cardDiv = createFlashcard(card);
  container.appendChild(cardDiv);

  progress.textContent = `${index + 1} / ${flashcards.length}`;
}

// ---------------------------
// Event Listeners
// ---------------------------
generateBtn.addEventListener("click", async () => {
  const notes = notesInput.value.trim();
  if (!notes) {
    statusDiv.textContent = "⚠ Please paste some notes first.";
    return;
  }

  statusDiv.textContent = "⏳ Generating flashcards...";
  try {
    const res = await axios.post("http://127.0.0.1:5000/generate", { notes });
    console.log("Backend response:", res.data); // Debug log

    if (res.data.flashcards && res.data.flashcards.length > 0) {
      flashcards = res.data.flashcards;
      currentIndex = 0;
      showFlashcard(currentIndex);
      statusDiv.textContent = `✅ Generated ${flashcards.length} card(s).`;
    } else {
      statusDiv.textContent = "⚠ No flashcards generated.";
    }
  } catch (err) {
    console.error("Error generating flashcards:", err);
    statusDiv.textContent = "❌ Error generating flashcards.";
  }
});

loadBtn.addEventListener("click", async () => {
  statusDiv.textContent = "⏳ Loading flashcards...";
  try {
    const res = await axios.get("http://127.0.0.1:5000/flashcards");
    console.log("Loaded flashcards:", res.data);

    if (res.data.flashcards && res.data.flashcards.length > 0) {
      flashcards = res.data.flashcards;
      currentIndex = 0;
      showFlashcard(currentIndex);
      statusDiv.textContent = `✅ Loaded ${flashcards.length} saved card(s).`;
    } else {
      statusDiv.textContent = "⚠ No saved flashcards.";
    }
  } catch (err) {
    console.error("Error loading flashcards:", err);
    statusDiv.textContent = "❌ Could not load flashcards.";
  }
});

clearBtn.addEventListener("click", async () => {
  try {
    await axios.post("http://127.0.0.1:5000/clear");
    flashcards = [];
    container.innerHTML = "";
    progress.textContent = "0 / 0";
    statusDiv.textContent = "🗑 All flashcards cleared.";
  } catch (err) {
    console.error("Error clearing flashcards:", err);
    statusDiv.textContent = "❌ Could not clear flashcards.";
  }
});

prevBtn.addEventListener("click", () => {
  if (flashcards.length > 0) {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showFlashcard(currentIndex);
  }
});

nextBtn.addEventListener("click", () => {
  if (flashcards.length > 0) {
    currentIndex = (currentIndex + 1) % flashcards.length;
    showFlashcard(currentIndex);
  }
});
