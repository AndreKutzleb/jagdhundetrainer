// Passwort (hardcoded)
const PASSWORD = "HundeQuiz2026";

// Globale Variablen
let breeds = [];          // Liste aller Hunderassen (Abkürzungen)
let breedImages = {};     // Wird aus der JSON geladen
let currentBreed = "";    // Aktuelle Rasse im Quiz
let score = 0;            // Punktestand
let wrongAnswers = [];    // Liste der falsch beantworteten Rassen
let currentIndex = 0;     // Aktueller Index im Quiz

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
            breeds = Object.keys(breedImages); // Alle Rassen aus der JSON extrahieren
            console.log("Verfügbare Rassen:", breeds); // Debug
            shuffleArray(breeds); // Zufällige Reihenfolge
            loadNextDog(); // Erster Hund laden
        })
        .catch(error => console.error('Fehler beim Laden der JSON:', error));
}

// Array mischen (für Zufallsreihenfolge)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Zufälliges Bild aus der JSON für die aktuelle Rasse auswählen
function getRandomImageForBreed(breed) {
    const images = breedImages[breed];
    if (!images || images.length === 0) {
        console.error(`Keine Bilder für Rasse ${breed} gefunden!`);
        return "";
    }
    // Zufälliges Bild aus der Liste der tatsächlichen Dateinamen auswählen
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imgPath = `Hunde/${breed}/${randomImage}`;
    console.log("Versuche, Bild zu laden:", imgPath); // Debug
    return imgPath;
}

// Nächsten Hund laden
function loadNextDog() {
    if (currentIndex < breeds.length) {
        currentBreed = breeds[currentIndex];
        const imgPath = getRandomImageForBreed(currentBreed);
        document.getElementById("dog-image").src = imgPath;
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
        document.getElementById("feedback").textContent = "";
    } else {
        showResults(); // Quiz beendet
    }
}

// Antwort prüfen
function submitAnswer() {
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
    currentIndex++;
    updateProgress();
    setTimeout(loadNextDog, 1500); // 1.5 Sekunden Pause
}

// Fortschritt aktualisieren
function updateProgress() {
    const progress = (currentIndex / breeds.length) * 100;
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("score").textContent = `${score}/${currentIndex}`;
}

// Ergebnisse anzeigen
function showResults() {
    document.querySelector(".quiz-container").innerHTML = `
        <h2>Quiz beendet!</h2>
        <p>Dein Score: ${score}/${breeds.length}</p>
        <h3>Falsch beantwortet:</h3>
        <ul>${wrongAnswers.map(breed => `<li>${breed}</li>`).join("")}</ul>
        <button onclick="window.location.reload()">Neu starten</button>
    `;
}

// Start: JSON laden und Quiz initialisieren
if (window.location.pathname.endsWith("quiz.html")) {
    loadBreedImages();
}
