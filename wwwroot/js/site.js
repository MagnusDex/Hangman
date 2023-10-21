"use strict";

const game = document.getElementById('game');
const playBtn = document.getElementById('play');
const cancelBtn = document.getElementById('cancel');
const wordTbl = document.getElementById('word');
const gallow = document.getElementById('gallow')
const letters = document.getElementById('letters');

var wordSecret;
var numberOfWrongLetters;

init();

function init() {
    playBtn.onclick = play;
    cancelBtn.onclick = cancel;
    letters.onclick = selectLetter;
    play();
}

function cancel() {
    showMissingLetters();
    playBtn.disabled = false;
    cancelBtn.disabled = true;
}

function showMissingLetters() {
    for (let i = 0; i < wordSecret.length; i++) {
        let cell = wordTbl.rows[0].cells[i];
        if (cell.innerText == '_') {
            cell.innerText = wordSecret.substring(i, i + 1).toUpperCase();
            cell.classList.add('missing');
        }
    }
}

async function play(e) {
    playBtn.disabled = true;
    cancelBtn.disabled = false;
    removeColorsFromCells();
    gallow.src = 'img/gallow0.png';
    numberOfWrongLetters = 0;

    showWait();

    wordSecret = await getRandomWord();
    showWordPlaceHolders();
}

function removeColorsFromCells() {
    let cells = Array.from(document.querySelectorAll('#letters td.used, #letters td.hit'));
    cells.forEach(cell => {
        cell.classList.remove('used');
        cell.classList.remove('hit');
    });
    cells = Array.from(document.querySelectorAll('#word td.missing'));
    cells.forEach(cell => {
        cell.classList.remove('missing');
        cell.classList.remove('hit');
    });
}

function showWait() {
    wordTbl.rows[0].innerHTML = '<td class="noBorder"><span style="color:blue; font-weight:bold;margin:0 1em;">Wait... </span></td>';
}

function showWordPlaceHolders() {
    let tds = ''
    for (let i = 1; i <= wordSecret.length; i++) {
        tds += '<td>_</td>';
    }
    wordTbl.rows[0].innerHTML = tds;
}

function selectLetter(e) {
    if (numberOfWrongLetters >= 8) return;
    if (wordTbl.rows[0].cells.length <= 1) return; // We are still waiting for a word, this assumes a word is more than 1 letter
    if (e.target.className == 'used') return;
    let letter = e.target.innerText;
    if (letter.length > 1) return; // We did not click on a cell

    e.target.classList.add('used');  
    if (tryUpdateWord(letter)) {
        e.target.classList.add('hit');
        return;
    }
    numberOfWrongLetters++;
    gallow.src = 'img/gallow' + numberOfWrongLetters + '.png';
    if (numberOfWrongLetters >= 8) cancel();
}

function tryUpdateWord(letter) {
    let aHit = false;
    let win = true;
    for (let i = 0; i < wordSecret.length; i++) {
        let cell = wordTbl.rows[0].cells[i];
        if (wordSecret.substring(i, i + 1).toUpperCase() == letter) {
            cell.innerText = letter;
            cell.classList.add('hit');
            aHit = true
        }
        if (cell.innerText == '_') {
            win = false;
        }
    }
    if (win) {
        gallow.src = 'img/gallow_win.png';
        cancel();
    }
    return aHit;
}

async function getRandomWord() {
    const response = await fetch('random_word');
    const json = await response.json();
    return json.word;
}