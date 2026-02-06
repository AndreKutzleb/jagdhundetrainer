// Passwort (hardcoded)
const PASSWORD = "HundeQuiz2026";

// Globale Variablen
let breeds = [];
let breedImages = {};
let currentBreed = "";
let score = 0;
let wrongAnswers = [];
let currentIndex = 0;
let answerSubmitted = false;

// Passwort prüfen
function checkPassword() {
    const input = document.getElementById("password").value;
    if (input === PASSWORD) {
        window.location.href = "quiz.html";
    } else {
        alert("Falsches Passwort!");
    }
}

// JSON-Datei laden und Quiz initialisieren
function loadBreedImages() {
    fetch('breed_images.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON nicht gefunden!");
            return response.json();
        })
        .then(data => {
            breedImages = data;
            breeds = Object.keys(breedImages);
            shuffleArray(breeds);
            loadNextDog();
            // Enter-Taste aktivieren
            document.getElementById("answer").addEventListener("keypress", handleKeyPress);
            updateProgress(); // Score sofort aktualisieren
        })
        .catch(error => console.error('Fehler:', error));
}

// Tastenanschlag verarbeiten
function handleKeyPress(e) {
    if (e.key === "Enter") {
        if (!answerSubmitted) {
            submitAnswer(); // Antwort abgeben
        } else {
            currentIndex++; // Nächster Index
            loadNextDog(); // Nächster Hund
        }
    }
}

// Array mischen
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Zufälliges Bild auswählen
function getRandomImageForBreed(breed) {
    const images = breedImages[breed];
    if (!images || images.length === 0) {
        console.error(`Keine Bilder für ${breed}!`);
        return "";
    }
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return `Hunde/${breed}/${randomImage}`;
}

// Nächsten Hund laden (mit Zurücksetzen der Hintergrundfarbe)
function loadNextDog() {
    if (currentIndex < breeds.length) {
        currentBreed = breeds[currentIndex];
        const imgPath = getRandomImageForBreed(currentBreed);
        document.getElementById("dog-image").src = imgPath;
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
        document.getElementById("feedback").textContent = "";
        document.getElementById("feedback").className = ""; // Hintergrundfarbe zurücksetzen
        answerSubmitted = false;
        updateProgress();
    } else {
        showResults();
    }
}

// Antwort prüfen
function submitAnswer() {
    if (answerSubmitted) return;

    const answer = document.getElementById("answer").value;
    if (answer === currentBreed) {
        score++;
        document.getElementById("feedback").textContent = "Richtig!";
        document.getElementById("feedback").className = "feedback correct";
    } else {
        wrongAnswers.push(currentBreed);
        document.getElementById("feedback").textContent = `Falsch! Richtig war: ${currentBreed}`;
        document.getElementById("feedback").className = "feedback wrong";
    }
    answerSubmitted = true;
    updateProgress();
    document.getElementById("feedback").innerHTML += "<br><strong>Drücke die Enter-Taste, um zum nächsten Hund zu kommen.</strong>";
}


// Fortschritt aktualisieren
function updateProgress() {
    const progress = breeds.length > 0 ? (currentIndex / breeds.length) * 100 : 0;
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("score").textContent = `${score}/${breeds.length} richtig`;
}

// Ergebnisse anzeigen
function showResults() {
    document.querySelector(".quiz-container").innerHTML = `
        <h2>Quiz beendet!</h2>
        <p>Dein Score: ${score}/${breeds.length} richtig</p>
        <h3>Falsch beantwortet:</h3>
        <ul>${wrongAnswers.map(breed => `<li>${breed}</li>`).join("")}</ul>
        <button onclick="window.location.reload()" autofocus>Neu starten</button>
    `;
}

// Start
if (window.location.pathname.endsWith("quiz.html")) {
    loadBreedImages();
}
