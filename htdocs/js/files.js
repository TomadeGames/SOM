var folderpath = 'SaufOMat';
var optionsFile = 'options.txt';

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}

//checkIfFileExists(file)
//  params:
//      file("file.txt")
//      create: wenn true wird datei erstellt
//  kein return, aber exist = true wenn Datei existiert

var exist;
function checkIfFileExists(file, create) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(folderpath + '/' + file, { create: create }, fileExists, fileDoesNotExist);
        }, getFSFail);
}

function fileExists(fileEntry) {
    exist = true;
}

function fileDoesNotExist() {
    exist = false;
}

//saveGame(player)
//  params:
//      player: das Array der Aktuellen Spielerdaten
//  kein return
//  Speichert das Aktuelle Spiel in save.txt

function saveGame(player, currPlayer) {
    var saveInput = "";
    saveInput += currPlayer+'\n';
    for (var i = 0; i < player.length; i++) {
        saveInput += player[i].name + ';' + player[i].weight + ';' + player[i].gender + ';' + player[i].drinkcount;
        saveInput += '\n';
    }
    write('save.txt', saveInput);
}



//read(file)
//  params:
//      file: "file.txt"
//  kein return, aber inhalt der Datei wird in readInput gespeichert.
//  Wenn keine Datei vorhanden ist-> readInput == '404'

var readInput;
function read(file) {
    readInput = '';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(folderpath + '/' + file, { create: false }, initFileRead, fileNotFound);
    }, getFSFail);
}

function initFileRead(fileEntry) {
    fileEntry.file(readFile, fail);
}

function fileNotFound() {
    readInput = '404';
}

function readFile(file) {
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        readInput = evt.target.result;
        readFinished();
    };
    reader.readAsText(file);
}


//write(_file, output)
//  params:
//      _file: die Datei in der geschrieben wird
//      output: der Inhalt, der in die Datei geschrieben wird
//  kein retur, aber success = true wenn erfolgreich geschrieben

var file;
var writeOutput;
var success;
function write(_file, output) {
    success = false;
    file = _file;
    writeOutput = output;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory(folderpath, { create: true, exclusive: false }, gotDirectory, getFSFail);
    }, getFSFail);
}


function getFSFail(evt) {
    alert('FSError');
}

/*function gotFS(fileSystem) {
    fileSystem.root.getDirectory(folderpath, { create: true, exclusive: false }, gotDirectory, getFSFail);
}*/

function gotDirectory(directory) {
    directory.getFile(file, { create: true, exclusive: false }, gotFileEntry, fail2);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail3);
}

function gotFileWriter(writer) {
    writer.onwriteend = function (evt) {
        success = true;
    };
    writer.write(writeOutput);
}

function fail1(error) {
    alert("1ne du :" + error.code);
}
function fail2(error) {
    alert("Directory is missing: " + error.code);
}
function fail3(error) {
    alert("3ne du :" + error.code);
}
function fail(error4) {
    alert("4ne du :" + error.code);
}
