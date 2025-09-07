// Custom multiple choice questions for each player
const playerQuestions = {
	1: { text: "Which country won the FIFA World Cup in 2018?", options: ["Brazil", "France", "Germany", "Argentina"], answer: 1 },
	2: { text: "How many players are on the field for one team in football?", options: ["9", "10", "11", "12"], answer: 2 },
	3: { text: "Which position is responsible for scoring goals?", options: ["Goalkeeper", "Defender", "Forward", "Midfielder"], answer: 2 },
	4: { text: "What is the maximum duration of a standard football match?", options: ["60 min", "90 min", "120 min", "45 min"], answer: 1 },
	5: { text: "Which country hosted the 2014 FIFA World Cup?", options: ["Brazil", "Russia", "Germany", "South Africa"], answer: 0 },
	6: { text: "What is the name of the area in front of the goal?", options: ["Penalty box", "Center circle", "Corner arc", "Sideline"], answer: 0 },
	7: { text: "Which player wears gloves?", options: ["Forward", "Defender", "Goalkeeper", "Midfielder"], answer: 2 },
	8: { text: "How many referees are on the field?", options: ["1", "2", "3", "4"], answer: 0 },
	9: { text: "Which is NOT a football position?", options: ["Striker", "Quarterback", "Winger", "Midfielder"], answer: 1 },
 10: { text: "What is the shape of a football pitch?", options: ["Square", "Rectangle", "Circle", "Triangle"], answer: 1 },
 11: { text: "Which part of the body is NOT allowed to touch the ball (except goalkeeper)?", options: ["Head", "Chest", "Feet", "Hands"], answer: 3 }
};

function showQuestionModal(playerNum) {
	const num = parseInt(playerNum);
	const q = playerQuestions[num] || playerQuestions[1];
	$("#question-title").text(`Player ${playerNum}: ${q.text}`);
	$("#question-options").html(
		q.options.map((opt, i) =>
			`<div><label><input type='radio' name='option' value='${i}'> ${opt}</label></div>`
		).join("")
	);
	$("#question-modal").css("display", "flex");
	$("#question-form").data("answer", q.answer);
}

$(document).ready(function() {
	// Start overlay logic
	$("#start-btn").on("click", function() {
		$("#start-overlay").fadeOut(400);
	});
	// Progression: only next unlocked player is enabled
	let currentUnlocked1 = 1;
	let currentUnlocked2 = 1;
	let activeTeam = 1; // 1 for team1, 2 for team2

	function updatePlayerStates() {
		if (activeTeam === 1) {
			$(".player.team1").each(function() {
				const num = parseInt($(this).text());
				if (num === currentUnlocked1) {
					$(this).removeClass("disabled");
				} else {
					$(this).addClass("disabled");
				}
			});
			$(".player.team2").addClass("disabled");
			$("#football1").show();
			$("#football2").hide();
			moveFootballToPlayer(1, currentUnlocked1);
		} else {
			$(".player.team2").each(function() {
				const num = parseInt($(this).text());
				if (num === currentUnlocked2) {
					$(this).removeClass("disabled");
				} else {
					$(this).addClass("disabled");
				}
			});
			$(".player.team1").addClass("disabled");
			$("#football2").show();
			$("#football1").hide();
			moveFootballToPlayer(2, currentUnlocked2);
		}
	}
	updatePlayerStates();
	$("#football2").hide();

	function moveFootballToPlayer(team, playerNum) {
		const $player = $(team === 1 ? ".player.team1" : ".player.team2").filter(function() {
			return parseInt($(this).text()) === playerNum;
		});
		const $ball = team === 1 ? $("#football1") : $("#football2");
		if ($player.length) {
			const pitchOffset = $("#pitch").offset();
			const playerOffset = $player.offset();
			const playerWidth = $player.outerWidth();
			const playerHeight = $player.outerHeight();
			const left = playerOffset.left - pitchOffset.left + playerWidth * 0.7;
			const top = playerOffset.top - pitchOffset.top + playerHeight * 0.7;
			$ball.css({ transition: 'left 0.5s, top 0.5s' });
			setTimeout(function() {
				$ball.css({ left: left + "px", top: top + "px" });
			}, 50);
		}
	}

	$(".player").on("click", function() {
		if ($(this).hasClass("disabled")) return;
		showQuestionModal($(this).text());
		$("#question-form").data("team", $(this).hasClass("team1") ? 1 : 2);
	});
	$("#close-modal").on("click", function() {
		$("#question-modal").hide();
	});
	$("#question-form").on("submit", function(e) {
		e.preventDefault();
		const selected = $("input[name='option']:checked").val();
		const answer = $("#question-form").data("answer");
		const team = $("#question-form").data("team");
		if (parseInt(selected) === answer) {
			alert("Correct!");
			// Unlock next player for the correct team, same team continues
			if (activeTeam === 1) {
				currentUnlocked1++;
			} else {
				currentUnlocked2++;
			}
			updatePlayerStates();
			$("#question-modal").hide();
		} else {
			alert("Incorrect. Turn passes to the other team!");
			// Do not unlock next player, just switch turn
			activeTeam = (activeTeam === 1) ? 2 : 1;
			updatePlayerStates();
			$("#question-modal").hide();
		}
	});
	// Initial ball position
	moveFootballToPlayer(currentUnlocked);
});
// Draw dashed lines between players 1-11 for each team, using a single SVG overlay
function getOrderedPlayers(teamClass) {
	return Array.from(document.querySelectorAll('.player.' + teamClass))
		.sort((a, b) => parseInt(a.textContent) - parseInt(b.textContent));
}

function getPlayerCenters(players) {
	const pitch = document.getElementById('pitch');
	const pitchRect = pitch.getBoundingClientRect();
	return players.map(player => {
		const rect = player.getBoundingClientRect();
		return {
			x: rect.left - pitchRect.left + rect.width / 2,
			y: rect.top - pitchRect.top + rect.height / 2
		};
	});
}

function drawDashedLines() {
	const svg = document.getElementById('player-lines');
	svg.innerHTML = '';
	// Team 1
	const team1 = getOrderedPlayers('team1');
	const centers1 = getPlayerCenters(team1);
	for (let i = 0; i < centers1.length - 1; i++) {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', centers1[i].x);
		line.setAttribute('y1', centers1[i].y);
		line.setAttribute('x2', centers1[i+1].x);
		line.setAttribute('y2', centers1[i+1].y);
		line.setAttribute('stroke', '#006400');
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke-dasharray', '10,8');
		svg.appendChild(line);
	}
	// Team 2
	const team2 = getOrderedPlayers('team2');
	const centers2 = getPlayerCenters(team2);
	for (let i = 0; i < centers2.length - 1; i++) {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', centers2[i].x);
		line.setAttribute('y1', centers2[i].y);
		line.setAttribute('x2', centers2[i+1].x);
		line.setAttribute('y2', centers2[i+1].y);
		line.setAttribute('stroke', '#1e90ff');
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke-dasharray', '10,8');
		svg.appendChild(line);
	}
}

window.addEventListener('DOMContentLoaded', drawDashedLines);
window.addEventListener('resize', drawDashedLines);
// Draw dashed lines between players 1-11 for each team, without removing any players
function getOrderedPlayers(teamClass) {
	// Sort by player number (textContent)
	return Array.from(document.querySelectorAll('.player.' + teamClass))
		.sort((a, b) => parseInt(a.textContent) - parseInt(b.textContent));
}

function getPlayerCenters(players) {
	const pitch = document.getElementById('pitch');
	const pitchRect = pitch.getBoundingClientRect();
	return players.map(player => {
		const rect = player.getBoundingClientRect();
		return {
			x: rect.left - pitchRect.left + rect.width / 2,
			y: rect.top - pitchRect.top + rect.height / 2
		};
	});
}

function drawDashedLines(teamClass, svgId, color) {
	const players = getOrderedPlayers(teamClass);
	const centers = getPlayerCenters(players);
	const svg = document.getElementById(svgId);
	// Clear previous lines
	svg.innerHTML = '';
	for (let i = 0; i < centers.length - 1; i++) {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', centers[i].x);
		line.setAttribute('y1', centers[i].y);
		line.setAttribute('x2', centers[i+1].x);
		line.setAttribute('y2', centers[i+1].y);
		line.setAttribute('stroke', color);
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke-dasharray', '10,8');
		svg.appendChild(line);
	}
}

function drawAllLines() {
	drawDashedLines('team1', 'team1-lines', '#006400');
	drawDashedLines('team2', 'team2-lines', '#1e90ff');
}

window.addEventListener('DOMContentLoaded', drawAllLines);
window.addEventListener('resize', drawAllLines);

// ...existing code for pitch and player rendering only...
