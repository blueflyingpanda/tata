const ENTER_CODE = 13;
const EXPIRATION_TIME = 3600 * 1000 * 24 * 365 * 10;

let seconds = 3600 * 24;

let currentTs = Math.floor(Date.now() / 1000);
if (localStorage.getItem("currentTs")) {
    seconds -= (currentTs - parseInt(localStorage.getItem("currentTs")));
    if (seconds < 0) {
        seconds = 0;
    }
} else {
    localStorage.setItem("currentTs", currentTs);
}

button = document.getElementsByClassName("wrap__input")[0];

let timesUp = false;
if (localStorage.getItem("timesUp")) {
    timesUp = localStorage.getItem("timesUp") === "true";
} else {
    localStorage.setItem("timesUp", timesUp);
}
if (timesUp) {
    button.placeholder = "время вышло";
}

let attemptsLeft = 10;
if (localStorage.getItem("attemptsLeft")) {
    attemptsLeft = parseInt(localStorage.getItem("attemptsLeft"));
} else {
    localStorage.setItem("attemptsLeft", attemptsLeft);
}

attempts = document.getElementById("attempts");

answer = document.getElementById("password");

phase1 = document.getElementsByClassName("wrap")[0];
phase2 = document.getElementById("phase2");



attempts.innerText = "попыток осталось: " + String(attemptsLeft);

document.addEventListener("DOMContentLoaded", () => {
	const timer = document.getElementById("timer");

	setInterval(() => {
        if (timesUp) {
            timer.innerText = "00:00:00";
            button.placeholder = 'время вышло';
            clearInterval(1);
            return;
        }
        if (!attemptsLeft) {
            timesUp = true;
            localStorage.setItem("timesUp", timesUp);
            return;
        }
		if (seconds - 1 < 0) {
            timesUp = true;
            localStorage.setItem("timesUp", timesUp);
			return;
		}
        seconds--;
		const addLeadingZero = (v) => "0".substring(v.length - 1) + v;
        const hours = String(Math.floor(seconds / 3600)).replace(/\d+/g, addLeadingZero);
        const tmp = Math.floor(seconds % 3600)
		const min = String(Math.floor(tmp / 60)).replace(/\d+/g, addLeadingZero);
		const sec = String(tmp % 60).replace(/\d+/g, addLeadingZero);
		const timeStr = `${hours}:${min}:${sec}`;
		timer.innerText = timeStr;
	}, 1000);
});

answer.addEventListener('keydown', submit);

function submit(event) {
	if (event.keyCode !== ENTER_CODE) {
		return;
	}
    processAnswer()
}

function processAnswer() {
    if (!answer.value || timesUp) {
        return;
    }
    const rightAnswerHash = "ef1291efca01c055aef1904c5abad79b5a91c5b142be022c1442fee289f86250";
    if (rightAnswerHash == String(CryptoJS.SHA256(answer.value.trim().toLowerCase()))){
        console.log("Well done!");
        localStorage.clear()
        clearInterval(1);
        answer.removeEventListener('keydown', submit);
        phase2.style.display = "block";
        phase1.style.display = "none";
    } else {
        if (attemptsLeft > 0) {
            attemptsLeft--;
            localStorage.setItem("attemptsLeft", attemptsLeft);
        }
        attempts.innerText = "попыток осталось: " + String(attemptsLeft);
    }
    answer.value = "";
}