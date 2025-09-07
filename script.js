const board = document.getElementById('board');
const rollBtn = document.getElementById('rollBtn');
const diceResult = document.getElementById('diceResult');
const commentary = document.getElementById('commentary');
const choicesDiv = document.getElementById('choices');

const fieldsData = [
    { type: 'question', text: 'Who won the 2018 World Cup?', options: ['France', 'Croatia', 'Brazil', 'Germany'], answer: 'France' },
    { type: 'fact', text: 'Football is played in over 200 countries.' },
    { type: 'question', text: 'Which player has won the most Ballon d\'Or?', options: ['Messi', 'Ronaldo', 'Neymar', 'Xavi'], answer: 'Messi' },
    { type: 'fact', text: 'A standard football match is 90 minutes.' },
    { type: 'question', text: 'Which country hosted the first World Cup?', options: ['Uruguay', 'Italy', 'Brazil', 'England'], answer: 'Uruguay' },
    { type: 'fact', text: 'The fastest goal in history was scored in 2.4 seconds.' },
    { type: 'question', text: 'Which team has the most Champions League titles?', options: ['Real Madrid', 'AC Milan', 'Liverpool', 'Bayern Munich'], answer: 'Real Madrid' },
    { type: 'fact', text: 'A football field is about 100 meters long.' }
];

let playerPosition = 0;
let waitingForAnswer = false;

// Create board
fieldsData.forEach((field, index) => {
    const div = document.createElement('div');
    div.classList.add('field');
    div.dataset.index = index;
    div.textContent = field.type === 'fact' ? 'Fact' : 'Q';
    board.appendChild(div);
});

// Highlight starting position
updatePlayerPosition();

// Dice roll
rollBtn.addEventListener('click', () => {
    if (waitingForAnswer) return; // prevent rolling if a question is active
    const roll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `You rolled: ${roll}`;
    movePlayer(roll);
});

function movePlayer(steps) {
    let newPosition = playerPosition + steps;
    if (newPosition >= fieldsData.length) newPosition = fieldsData.length - 1;
    playerPosition = newPosition;
    updatePlayerPosition();

    const field = fieldsData[playerPosition];

    if (field.type === 'question') {
        showQuestion(field);
    } else if (field.type === 'fact') {
        commentary.textContent = `Fact: ${field.text}`;
        choicesDiv.innerHTML = '';
        if (playerPosition === fieldsData.length - 1) {
            commentary.textContent += ' 🏆 You reached the end!';
        }
    }
}

function updatePlayerPosition() {
    document.querySelectorAll('.field').forEach(div => div.classList.remove('player'));
    const currentField = document.querySelector(`.field[data-index='${playerPosition}']`);
    if (currentField) currentField.classList.add('player');
}

function showQuestion(field) {
    waitingForAnswer = true;
    commentary.textContent = field.text;
    choicesDiv.innerHTML = '';

    field.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.classList.add('btn', 'btn-secondary', 'choice-btn');
        btn.addEventListener('click', () => checkAnswer(option, field.answer));
        choicesDiv.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        commentary.textContent = `✅ Correct!`;
    } else {
        commentary.textContent = `❌ Wrong! The correct answer was "${correct}".`;
        // Optional: move back 1 space for wrong answer
        if (playerPosition > 0) playerPosition--;
    }
    choicesDiv.innerHTML = '';
    updatePlayerPosition();
    waitingForAnswer = false;
}
