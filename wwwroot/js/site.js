"use strict";

init();

function init() {
    document.getElementById('playHangman').onclick = playHangman;
    document.getElementById('letters').onclick = selectLetter;

}

function playHangman() {
    getRandomWord();



}

function selectLetter(e) {
    if (e.target.className == 'used') return;

    alert(e.target.innerText);

}

function getRandomWord() {
    fetch('random_word')
        .then(response => response.json())
        .then(data => { alert(data.word) })
        .catch(error => console.error('Unable to get word.', error));
}