// DOM elements
const timeDisplay = document.getElementById('timeDisplay'); // Main time display
const savedTimeDisplay = document.getElementById('savedTimeDisplay'); // Saved time display
const playPauseButton = document.getElementById('playPauseButton'); // Play/Pause button
const resetButton = document.getElementById('resetButton'); // Reset button
const playPauseIcon = document.getElementById('playPauseIcon'); // Icon inside Play/Pause button
const savedResultsContainer = document.getElementById('savedResultsContainer'); // Container for saved results
const saveTimeButton = document.getElementById('saveTimeButton'); // Save result button

// Initialize button states
playPauseButton.disabled = false;

// Stopwatch variables
let [minutesMain, secondsMain, millisecondsMain] = [0, 0, 0]; // Main timer values
let [minutesOffset, secondsOffset, millisecondsOffset] = [0, 0, 0]; // Offset timer for lap times
let timer = null; // Timer interval variable
let lapIndex = 1; // Index for lap results
const maxDisplayedLaps = 6; // Maximum number of laps to display
localStorage.clear();
// Main stopwatch function
function updateStopwatch() {
    // Update main timer
    millisecondsMain++;
    if (millisecondsMain === 100) {
        millisecondsMain = 0;
        secondsMain++;
        if (secondsMain === 60) {
            secondsMain = 0;
            minutesMain++;
        }
    }
    let formattedMinutesMain = minutesMain < 10 ? '0' + minutesMain : minutesMain;
    let formattedSecondsMain = secondsMain < 10 ? '0' + secondsMain : secondsMain;
    let formattedMillisecondsMain = millisecondsMain < 10 ? '0' + millisecondsMain : millisecondsMain;
    timeDisplay.innerHTML = `${formattedMinutesMain}:${formattedSecondsMain}.${formattedMillisecondsMain}`;

    // Update offset timer
    millisecondsOffset++;
    if (millisecondsOffset === 100) {
        millisecondsOffset = 0;
        secondsOffset++;
        if (secondsOffset === 60) {
            secondsOffset = 0;
            minutesOffset++;
        }
    }
    let formattedMinutesOffset = minutesOffset < 10 ? '0' + minutesOffset : minutesOffset;
    let formattedSecondsOffset = secondsOffset < 10 ? '0' + secondsOffset : secondsOffset;
    let formattedMillisecondsOffset = millisecondsOffset < 10 ? '0' + millisecondsOffset : millisecondsOffset;
    savedTimeDisplay.innerHTML = `+${formattedMinutesOffset}:${formattedSecondsOffset}.${formattedMillisecondsOffset}`;
    saveData(); // Save current time data in local storage
}

// Start or pause the stopwatch
function toggleStopwatch() {
    saveTimeButton.disabled = true;
    resetButton.disabled = true;
    if (playPauseIcon.classList.contains('fa-play')) {
        clearInterval(timer);
        timer = setInterval(updateStopwatch, 10);
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
        saveTimeButton.disabled = false;
    } else {
        clearInterval(timer);
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
        resetButton.disabled = false;
    }
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(timer);
    [minutesMain, secondsMain, millisecondsMain] = [0, 0, 0];
    timeDisplay.innerHTML = "00:00.00";
    [minutesOffset, secondsOffset, millisecondsOffset] = [0, 0, 0];
    savedTimeDisplay.innerHTML = "";
    playPauseIcon.classList.replace('fa-pause', 'fa-play');
    playPauseButton.disabled = false;
    resetButton.disabled = true;
    savedResultsContainer.innerHTML = "";
    lapIndex = 1;
    localStorage.clear(); // Clear saved data
}

// Save the current time in local storage
function saveData() {
    localStorage.setItem('displayTime', timeDisplay.innerHTML);
    localStorage.setItem('savedTime', savedTimeDisplay.innerHTML);
}

// Save the current result to the results container, with rolling log behavior
function saveCurrentTime() {
    // Reset the offset timer for the new lap time
    [minutesOffset, secondsOffset, millisecondsOffset] = [0, 0, 0];

    // Create a new result entry
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-item');
    
    // Populate result entry with lap index and current time details
    resultDiv.innerHTML = `
        <div>
            <p class="resultIndex">0${lapIndex}</p>
            <p class="lapTime">${localStorage.getItem('savedTime')}</p>
        </div>
        <p class="mainTime">${localStorage.getItem('displayTime')}</p>
    `;
    
    // Increment the lap index for the next lap
    lapIndex++;

    // Insert the new result at the top of the container
    if (savedResultsContainer.children.length >= maxDisplayedLaps) {
        // If max laps are displayed, remove the last (oldest) entry before adding the new one
        savedResultsContainer.removeChild(savedResultsContainer.lastChild);
    }
    savedResultsContainer.insertBefore(resultDiv, savedResultsContainer.firstChild);

    // Update local storage with the current results
    localStorage.setItem('result', savedResultsContainer.innerHTML);
}


// Show previously saved results on page load
function loadSavedResults() {
    savedResultsContainer.innerHTML = localStorage.getItem('result');
}
loadSavedResults(); // Load saved results on initial page load
