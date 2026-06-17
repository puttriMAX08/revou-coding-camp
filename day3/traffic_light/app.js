// Get variable
const red = document.getElementById("red");
const yellow = document.getElementById("yellow");
const green = document.getElementById("green");
const switchBtn = document.getElementById("switchBtn");

// Initial value
function resetLights() {
	red.style.background = "#444";
	yellow.style.background = "#444";
	green.style.background = "#444";
}

let current = "red";
red.style.background = "red";

// Switch light
function switchLight() {
	switchBtn.disabled = true;
	resetLights();

	// Nyalain kuning dulu
	yellow.style.background = "yellow";

	setTimeout(() => {
		resetLights();

		if (current === "red") {
			green.style.background = "lime";
			current = "green";
		} else {
			red.style.background = "red";
			current = "red";
		}

		switchBtn.disabled = false;
	}, 1000); // kuning nyala 300ms
}

switchBtn.addEventListener("click", switchLight);