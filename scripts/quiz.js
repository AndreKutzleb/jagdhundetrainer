// Passwort (hardcoded)
const PASSWORD = "HundeQuiz2026";

// Globale Variablen
let breeds = [];         // Liste aller Hunderassen (Abkürzungen)
let currentBreed = "";   // Aktuelle Rasse im Quiz
let score = 0;           // Punktestand
let wrongAnswers = [];   // Liste der falsch beantworteten Rassen
let currentIndex = 0;    // Aktueller Index im Quiz

// Passwort prüfen
function checkPassword() {
    const input = document.getElementById("password").value;
    if (input === PASSWORD) {
        window.location.href = "quiz.html";
    } else {
        alert("Falsches Passwort!");
    }
}

// Quiz initialisieren
function initQuiz() {
    // Beispiel: Liste der Hunderassen (ersetze dies mit deinen tatsächlichen Abkürzungen)
    breeds = ["DB", "LB", "JT", "WH"]; // Beispiel – ersetze mit deinen Daten!
    shuffleArray(breeds); // Zufällige Reihenfolge
    loadNextDog();
}

// Array mischen (für Zufallsreihenfolge)
function shuffleArray(array) {
    for ( let i = array.length - 1; i > 0; i-- ) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Zufälliges Bild aus dem Ordner Hunde/${breed}/ auswählen
function getRandomImageForBreed(breed) {
    // Annahme: Jeder Ordner enthält Bilder mit Namen wie "1.jpg", "2.jpg", etc.
    // Hier musst du die tatsächlichen Bildnamen anpassen oder eine Liste der Bilder pro Rasse erstellen.
    // Beispiel: Für "DB" gibt es 3 Bilder: "1.jpg", "2.jpg", "3.jpg"
    const imageCount = 3; // Ersetze dies mit der tatsächlichen Anzahl der Bilder pro Rasse
    const randomIndex = Math.floor(Math.random() * imageCount) + 1;
    return `Hunde/${breed}/${randomIndex}.jpg`;
}

// Nächsten Hund laden
function loadNextDog() {
    if ( currentIndex < breeds.length ) {
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
    if ( answer === currentBreed ) {
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
    setTimeout(loadNextDog, 1500); // 1.5 Sek. Pause
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

// Start
if ( window.location.pathname.endsWith("quiz.html") ) {
    initQuiz();
}
