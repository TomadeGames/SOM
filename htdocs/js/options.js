//Beötigt Files.js und Sounds.js

//Allgemeine Variabeln
var optionsWindow;
var isOptionsShown = false;
var optionViewElements = [];
var isIngame = false;

//Buttons
var soundButton;
var saveOptionsButton;
var abortButton;
var playerTasksButton;
var languageButton;

//Texte
var abortText;
var playerTasksText;
var optionTexts;

function initOptions(yesButtonImage, noButtonImage, popUp, soundButtonImage, invisibleImage, spracheButtonImage, _optionTexts, _isIngame) {  //am Ende der Create aufrufen
    isIngame = _isIngame;
    optionTexts = _optionTexts;
    optionViewElements.push(invisibleOptionsButton = game.add.button(0, 0, null));
    invisibleOptionsButton.width = w;
    invisibleOptionsButton.height = w;
    invisibleOptionsButton.visible = false;

    optionViewElements.push(optionsWindow = game.add.image(game.world.centerX, game.world.centerY, popUp));
    optionsWindow.anchor.set(0.5);
    optionsWindow.width = game.width;
    optionsWindow.height = game.height;
    optionsWindow.visible = false;

    optionViewElements.push(endButton = game.add.button(0, 0, noButtonImage, endGame, this));
    endButton.width = game.width / 3;
    endButton.height = h / 6;
    endButton.x = w - endButton.width;
    endButton.y = h - endButton.height;
    endButton.visible = false;

    optionViewElements.push(endText = game.add.text(endButton.x + endButton.width / 2, endButton.y + endButton.height / 2, optionTexts[2], { font: '200% Arial', fill: '#fff', align: 'center' }));
    endText.anchor.set(0.5);
    endText.visible = false;
    endText.fontSize = h / 16;
    
    optionViewElements.push(saveOptionsButton = game.add.button(0, 0, yesButtonImage, closeSaveOptions, this));
    saveOptionsButton.width = game.width / 3;
    saveOptionsButton.height = game.height / 6;
    saveOptionsButton.x = endButton.x - saveOptionsButton.width;
    saveOptionsButton.y = endButton.y;
    saveOptionsButton.visible = false;

    optionViewElements.push(abortButton = game.add.button(0, saveOptionsButton.y, noButtonImage, abortOptions, this));
    abortButton.width = game.width / 3;
    abortButton.height = game.height / 6;
    abortButton.visible = false;

    optionViewElements.push(abortText = game.add.text(abortButton.x + abortButton.width / 2, abortButton.y + abortButton.height / 2, optionTexts[0], { font: '200% Arial', fill: '#fff', align: 'center' }));
    abortText.anchor.set(0.5);
    abortText.visible = false;
    abortText.fontSize = h / 16;

    optionViewElements.push(soundButton = game.add.button(game.world.centerX / 3, game.world.centerY / 3, soundButtonImage, toggleSound));
    soundButton.width = game.width / 10;
    soundButton.height = soundButton.width;
    soundButton.visible = false;
    if (isMuted) {
        soundButton.frame = 1;
    }
    else {
        soundButton.frame = 0;
    }

    optionViewElements.push(languageButton = game.add.button(game.world.width - game.world.centerX / 3, game.world.centerY / 3, spracheButtonImage, toggleLanguage));
    languageButton.width = soundButton.width;
    languageButton.height = soundButton.height;
    languageButton.x -= languageButton.width;
    languageButton.visible = false;
    if (language == 'de') {
        languageButton.frame = 0;
    }
    else {
        languageButton.frame = 1;
    }

    optionViewElements.push(playerTasksButton = game.add.button(game.world.centerX + game.world.centerX / 10, soundButton.y, noButtonImage, playerTasksButtonClick, this));
    playerTasksButton.width = abortButton.width;
    playerTasksButton.height = abortButton.height;
    playerTasksButton.visible = false;

    optionViewElements.push(playerTasksText = game.add.text(playerTasksButton.x + playerTasksButton.width / 2, playerTasksButton.y + playerTasksButton.height / 2, optionTexts[1], { font: '200% Arial', fill: '#fff', align: 'center' }));
    playerTasksText.anchor.set(0.5);
    playerTasksText.visible = false;

    if (isIngame) {
        optionViewElements.push(deleteCurrPlayerButton = game.add.button(game.world.centerX, soundButton.y, noButtonImage, deleteButtonClick, this));
        deleteCurrPlayerButton.width = abortButton.width;
        deleteCurrPlayerButton.height = abortButton.height;
        deleteCurrPlayerButton.visible = false;

        optionViewElements.push(deleteCurrPlayerLabel = game.add.text(deleteCurrPlayerButton.x + deleteCurrPlayerButton.width / 2, deleteCurrPlayerButton.y + deleteCurrPlayerButton.height / 2, optionTexts[3], { font: '200% Arial', fill: '#fff', align: 'center' }));
        deleteCurrPlayerLabel.anchor.set(0.5);
        deleteCurrPlayerLabel.fontSize = h / 16;
        deleteCurrPlayerLabel.visible = false;
        deleteCurrPlayerButton.width = deleteCurrPlayerLabel.width * 1.1;
        deleteCurrPlayerLabel.x = deleteCurrPlayerButton.x + deleteCurrPlayerButton.width / 2;
        deleteCurrPlayerLabel.y = deleteCurrPlayerButton.y + deleteCurrPlayerButton.height / 2
    }

    /*optionViewElements.push(drinkAlcoholLabel = game.add.text(soundButton.x, h-h/2, '15%', { font: '200% Arial', fill: '#fff', align: 'center' }));
    drinkAlcoholLabel.visible = false;
    optionViewElements.push(drinkSizeLabel = game.add.text(soundButton.x+drinkAlcoholLabel.width*1.1, h-h/8, '0,02', { font: '200% Arial', fill: '#fff', align: 'center' }));
    drinkSizeLabel.visible = false;*/
}

function toggleLanguage() {
    if (languageButton.frame == 1) {
        languageButton.frame = 0;
    }
    else {
        languageButton.frame++;
    }
}

function deleteButtonClick() {
    if (player.length > 1) {
        player.splice(currPlayer, 1);
        drinkCounter[currPlayer].destroy();
        drinkCounter.splice(currPlayer, 1);
        localStorage.setItem('currPlayer', currPlayer);
        for (var i = 0; i < player.length; i++) {
            localStorage.setItem('playername' + i, player[i].name);
            localStorage.setItem('playerdrinks' + i, player[i].drinkcount);
        }
        localStorage.setItem('playercount', player.length);
        closeOptions();
        currPlayer--;
        endRound();
    }
    for (var i = 0; i < drinkCounter.length; i++) {
        drinkCounter[i].text = player[i].name + ': ' + player[i].drinkcount;
    }
}

function showOptions() {
    playAudio('/android_asset/www/assets/sounds/button.wav');
    for (var i = 0; i < optionViewElements.length; i++) {
        optionViewElements[i].visible = true;
    }
    if (isIngame) {
        if (player.length <= 1) {
            console.log('versteckt');
            deleteCurrPlayerLabel.visible = false;
            deleteCurrPlayerButton.visible = false;
        }
    }
    playerTasksButton.visible = false;
    playerTasksText.visible = false;
    //TODO:
    languageButton.visible = false;
    isOptionsShown = true;
}

function closeOptions() {
    playAudio('/android_asset/www/assets/sounds/button.wav');
    for (var i = 0; i < optionViewElements.length; i++) {
        optionViewElements[i].visible = false;
    }
    isOptionsShown = false;
}

function toggleOptions() {
    playAudio('/android_asset/www/assets/sounds/button.wav');
    saveOptionsButton.visible = !saveOptionsButton.visible;
    abortButton.visible = !abortButton.visible;
    abortText.visible = !abortText.visible;
    optionsWindow.visible = !optionsWindow.visible;
    soundButton.visible = !soundButton.visible;
    playerTasksButton.visible = !playerTasksButton.visible;
    playerTasksText.visible = !playerTasksText.visible;
    invisibleButton.visible = !invisibleButton.visible;
}

function playerTasksButtonClick() {
    showOwnTasksMenue();
}

function showOwnTasksMenue() {
    closeOptions();
    saveOptionsButton.visible = true;
    invisibleButton.visible = true;
    optionsWindow.visible = true;
    abortButton.visible = true;
    abortText.visible = true;
    abortButton.onInputUp.removeAll();
    abortButton.onInputUp.add(closeTasksMenue);
    saveOptionsButton.onInputUp.removeAll();
    saveOptionsButton.onInputUp.add(saveTasks);
}

function closeTasksMenue() {
    showOptions();
    abortButton.onInputUp.removeAll();
    abortButton.onInputUp.add(abortOptions);
    saveOptionsButton.onInputUp.removeAll();
    saveOptionsButton.onInputUp.add(closeSaveOptions);
}

function endGame() {
    if (isIngame) {
        document.location.href = "hauptmenue.html";
    }
    else {
        navigator.app.exitApp();
    }
}

function saveTasks() {

    closeTasksMenue();
}

function abortOptions() {
    if (isMuted) {
        soundButton.frame = 1;
    }
    else {
        soundButton.frame = 0;
    }
    closeOptions();
}

function closeSaveOptions() {
    if (soundButton.frame == 0 && languageButton.frame == 0) {
        isMuted = false;
        write('options.txt', 'mute:0\nlangauge:de');
    }
    else if (soundButton.frame == 0 && languageButton.frame == 1){
        isMuted = true;
        write('options.txt', 'mute:0\nlangauge:en');
    }
    else if (soundButton.frame == 1 && languageButton.frame == 0) {
        isMuted = true;
        write('options.txt', 'mute:1\nlangauge:de');
    }
    else if (soundButton.frame == 1 && languageButton.frame == 1) {
        isMuted = true;
        write('options.txt', 'mute:1\nlangauge:en');
    }
    closeOptions();
}

function toggleSound() {
    if (soundButton.frame == 1) {
        soundButton.frame = 0;
    }
    else {
        soundButton.frame++;
    }
}