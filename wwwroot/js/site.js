"use strict";

// Using the IIFE to avoid globals
(function () {

    const playBtn = document.getElementById('play');
    const cancelBtn = document.getElementById('cancel');
    const helpBtn = document.getElementById('help');
    const helpClose = document.getElementById('helpClose');
    const helpDlg = document.getElementById('helpDlg');
    const wordTbl = document.getElementById('word');
    const gallow = document.getElementById('gallow')
    const letters = document.getElementById('letters');
    const misses = document.getElementById('misses');

    playBtn.onclick = play;
    cancelBtn.onclick = cancel;
    helpBtn.onclick = showHelp;
    helpClose.onclick = closeHelp;
    letters.onclick = selectLetter;

    var wordSecret;
    var numberOfWrongLetters;

    play();



    // ------------------- Functions -----------------------

    function showHelp() {
        helpDlg.showModal();
    }
    function closeHelp() {
        helpDlg.close();
    }
    function cancel() {
        showMissingLetters();
        misses.style.visibility = 'hidden';
        misses.style.color = '';
        playBtn.disabled = false;
        cancelBtn.disabled = true;
    }

    function showMissingLetters() {
        if (!wordSecret) return;
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

        wordSecret = null;
        try { 
            wordSecret = await getRandomWord();
            showWordPlaceholders();
        } catch (err) {
            wordTbl.rows[0].innerHTML = '<td class="noBorder"><span style="color:red; font-weight:bold; white-space:nowrap;">Was not able to come up with a secret word. Please press Play again.</span></td>';
            cancel();
        }
        misses.innerText = '(You can miss 7 times)'
        misses.style.visibility = 'visible';
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
        wordTbl.rows[0].innerHTML = '<td class="noBorder"><span style="color:blue; font-weight:bold;">Wait... </span></td>';
    }

    function showWordPlaceholders() {
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
        if (numberOfWrongLetters >= 8) {
            cancel();
        } else {
            let msg;
            switch (numberOfWrongLetters) {
                case 6:
                    msg = '(You can only miss 1 more time)';
                    break;
                case 7:
                    msg = '(You cannot miss any more times)';
                    break;
                default:
                    msg = '(You can miss ' + (7 - numberOfWrongLetters) + ' times more)';
            }
            if (7 - numberOfWrongLetters <= 3) {
                misses.style.color = 'red';
            }
            misses.innerText = msg;
        }
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
        if (response.status == 200) {
            const json = await response.json();
            return json.word;
        }
        throw ("error encountered");
    }

}());
