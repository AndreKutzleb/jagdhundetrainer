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
    // Alle Unterordner in "Hunde/" laden (z. B. ["DB", "LB", ...])
    // Hier später mit fetch() oder statischer Liste ersetzen
    breeds = ["DB", "LB", "JT"]; // Beispiel – ersetze mit deinen Daten!
    shuffleArray(breeds); // Zufällige Reihenfolge
    loadNextDog();
}

// Array mischen (für Zufallsreihenfolge)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Nächsten Hund laden
function loadNextDog() {
    if (currentIndex < breeds.length) {
        currentBreed = breeds[currentIndex];
        // Bild aus dem Ordner "Hunde/DB/" zufällig auswählen
        const imgPath = `Hunde/${currentBreed}/`; // Beispiel: "Hunde/DB/1.jpg"
        // Hier: Logik zum Laden eines zufälligen Bildes aus dem Ordner
        document.getElementById("dog-image").src = imgPath + "1.jpg"; // Platzhalter
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
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
if (window.location.pathname.endsWith("quiz.html")) {
    initQuiz();
}
