//$(document).ready(initialize);
$(document).on("pagecreate", "#pageone", initialize);

var playerCount = 0;    //id, colheaders count from 0 - current playercount (max 0-9)
var currentElement;
var currentElemPlayerIndex = -1;//currentCollheader
var currentElemIndex = -3;//currentElementOfCollheader
var scrollSpeed = 600;
var doCollapsibleEvent = true;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var deleteId; //which collapsible is to be removed
var einString ='yolo';
var playerArray = [];
var currPlayer = 0;
var texts = [];
var language = 'gersman';

document.addEventListener("deviceready", onDeviceReady, false);

function loadLanguage() {
    var path;
    language = localStorage.getItem('language');
    if (language == 'de-DE') {
        path = 'assets/Daten/Languages/spielErstellen/german.json';
    }
    else {
        path = 'assets/Daten/Languages/spielErstellen/english.json';
        $('#h01_1').html('Create Players');
    }
    $.getJSON(path, function (data) {
        texts = data;
        $('a#submitButton').text(texts[0]);
        $('a#addButton').text(texts[1]);
        $('a#deleteDialog').text(texts[9]);
        $('a#cancelDialog').text(texts[10]);
        $('a#maleButton').text(texts[5]);
        $('a#femaleButton').text(texts[6]);
        $('a#deleteButton').text(texts[7]);
        $('#name').attr("placeholder", texts[11]);
        $("label[for='name']").text(texts[2]);
        $("label[for='weight']").text(texts[3]);
        $("label[for='gender']").text(texts[4]);
    })
}

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function initialize() {
    loadLanguage();

    //currentElement = $('#colPlayer' + playerCount);//.find('label').eq(0);
    currentElement = $('#h01_1');

    $('#deleteButton').hide();
    $('#colPlayer' + playerCount).find('#hideInput').hide();
    $('#colPlayer' + playerCount).find('#hiddenInput').val('m');
    //$('#colPlayer'+playerCount).find('input').eq(0).attr('id', 'name'+playerCount);

    $('#colPlayer0').find('input').eq(0).focus();

    //New Player    
    $('#addButton').click(function () {
        playerCount++;
        //deep copy player inputs from first player into new collapsible header
        $('#deleteButton').show();
        var colHeader = '<div id="colPlayer' + playerCount + '" data-role="collapsible"><h3>'+texts[13] + (playerCount + 1) + '</h3></div>'
        $('#colset').append(colHeader);
        $('#colPlayer0').find('#colContent').clone().appendTo('#colPlayer' + playerCount);
        $('#colPlayer' + playerCount).attr('data-collapsed', 'false');
        $('#colset').collapsibleset('refresh');


        $('#deleteButton').hide();
        $('#colPlayer' + playerCount).find('#hideInput').hide();
        //input fields reset to default values
        $('#colPlayer' + playerCount).addClass('colPlayerclass');
        $('#colPlayer' + playerCount).find('input').eq(0).val(null);//name        
        $('#colPlayer' + playerCount).find('input').eq(1).val(70);//weight          
        $('#colPlayer' + playerCount).find('label').eq(0).text(texts[2] + texts[13] + (playerCount + 1));
        $('#colPlayer' + playerCount).find('.genderLabel').children('label').empty();//gender
        $('#colPlayer' + playerCount).find('.genderLabel').children('label').append(texts[4]);
        $('#colPlayer' + playerCount).find('#hiddenInput').val('m');
        $('#colPlayer' + playerCount).find('#maleButton').addClass('blueButton');
        $('#colPlayer' + playerCount).find('#femaleButton').removeClass('blueButton');

        //Focus & Scrolling to New Player
        $('#colPlayer' + playerCount).find('input').eq(0).focus();
        currentElement = $('#colPlayer' + playerCount).find('input').eq(0);        
        currentElemPlayerIndex = playerCount;
        currentElemIndex = 0;  
        $('html, body').animate({
            scrollTop: $('#colPlayer' + playerCount).find('label').eq(0).offset().top
        }, scrollSpeed);
    });

    $('#submitButton').click(function () {
        if (checkPlayerNames()) {
            var player = [];
            for (var i = 0; i < playerCount + 1; i++) {
                player.push({ name: $('#colPlayer' + i).find('input').eq(0).val(), weight: $('#colPlayer' + i).find('input').eq(1).val(), gender: $('#colPlayer' + i).find('input').eq(2).val() });
            }
            localStorage.setItem('playercount', player.length);
            for (var i = 0; i < player.length; i++) {
                localStorage.setItem('playername' + i, player[i].name);
                localStorage.setItem('playerweight' + i, player[i].weight);
                localStorage.setItem('playergender' + i, player[i].gender);
                localStorage.setItem('playerdrinks' + i, 0);
            }
            localStorage.setItem('currPlayer', 0);
            localStorage.setItem('newGame', 1);
            document.location.href = 'mainGame.html';
        }
    });

    $(document).on('keyup', 'input#name', function () {
        var currentName = $(this).val();
        console.log(currentName);
        if (!(currentName == '' || currentName == null)) {
            $(this).parents('#colContent').parent().siblings().html('<a class="ui-collapsible-heading-toggle ui-btn ui-icon-carat-d ui-btn-icon-left ui-btn-inherit" href="#">' + currentName + '<span class="ui-collapsible-heading-status">click to collapse contents</span></a>');           
            $(this).parents('#colContent').find('label').eq(0).text(texts[2] + currentName);
        }
    });

    $(document).on('keyup', '.numbersOnly', function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    $(document).on('click', '.genderButton', function () {
        var genderLabelContent = $(this).parents('.genderButtonMargin').siblings('.genderLabel').children('label');
        var genderInput = $(this).parents('#colContent').find('input').eq(2);//wörkt
        //wörkt nicht var genderInput = $(this).parents('#genderButtonMargin').siblings('.genderLabel').children('input');
        if ($(this).attr('id') == 'maleButton') {
            $(this).addClass('blueButton');
            $(this).siblings('.blueButton').removeClass('blueButton');
            genderInput.val('m');
            //alert(''+genderLabelContent.val());
        }
        else {
            $(this).addClass('blueButton');
            $(this).siblings('.blueButton').removeClass('blueButton');
            genderInput.val('w');
            //alert(''+genderLabelContent.val());
        }
    });

    //which redButton/deletebutton -> delete the dependent colPlayer+deleteId //var id = 'bla456' var lastChar = id.substr(id.length - 2); // => '56'    
    $(document).on('click', '.redButton', function () {
        deleteId = $(this).parents('.colPlayerclass').attr('id');
        deleteId = deleteId.substr(deleteId.length - 1);
        //rename the confirmation label
        var playername = $(this).parents('#colContent').find('input#name').val()
        if (playername == '' || playername == null) {
            playername = $(this).parents('#colContent').parent().siblings().children('a').text().replace(' click to collapse contents', '');
        }
        $('#deleteConfirmation').html(texts[12] + playername + texts[8]);
        playername = '';
        //from input to header$(this).parents('#colContent').parent().siblings().html(

    });

    $(document).on('click', '#deleteDialog', function () {
        if (deleteId == 0) {
            alert('Du kannst den ersten Spieler nicht löschen!');
        }
        else {
            $('#colPlayer' + deleteId).remove();
            $('#colset').collapsibleset('refresh');
            updateColplayerId(deleteId);
        }
    });

    $(document).on('click', '#topBtn', function () {
        console.log('player: ' + currentElemPlayerIndex + ' index: ' + currentElemIndex + ' top' );
        $('html, body').animate({
            scrollTop: $('#addButton').offset().top
        }, scrollSpeed);      
    });

    $(document).on('click', '#downBtn', function () {
        if(currentElemPlayerIndex < 0){        
            currentElement = $('#colPlayer0').find('label').eq(0);
            currentElemIndex = 0;
            currentElemPlayerIndex = 0;
        }
        if(currentElement.parents().is('.ui-collapsible-collapsed')){
            doCollapsibleEvent = false;
            currentElement.parents('.ui-collapsible-collapsed').collapsible('expand');
        }        
        console.log('player: ' + currentElemPlayerIndex + ' index: ' + currentElemIndex + ' back' );
        $('html, body').animate({
            scrollTop: currentElement.offset().top
        }, scrollSpeed);
    });

    $(document).on('click', '#lastBtn', function () {
        if(currentElement.parents().is('.ui-collapsible-collapsed')){
            doCollapsibleEvent = false;
            currentElement.parents('.ui-collapsible-collapsed').collapsible('expand');
        }  
        if(currentElemIndex > 0){
            currentElemIndex--;   
            currentElement = $('#colPlayer' + currentElemPlayerIndex).find('label').eq(currentElemIndex);         
        }
        else{
            //hoch zum Namen//wenn man das weglassen möchte (direkt zum oberen Player gender)
            //dann diesen if block + Inhalt und das else auskommentieren
            if(currentElemIndex == 0){
                currentElemIndex--;
                currentElement = $('#colPlayer' + currentElemPlayerIndex);
            }
            //auf Namen (index -1), zum vorherigen Spieler
            else{
                if(currentElemPlayerIndex > 0){
                    currentElemIndex = 2;
                    currentElemPlayerIndex--;   
                    currentElement = $('#colPlayer' + currentElemPlayerIndex).find('label').eq(currentElemIndex);                             
                    $('html, body').animate({
                        scrollTop: $('#colPlayer' + currentElemPlayerIndex).offset().top
                    }, scrollSpeed * 0.7);
                    doCollapsibleEvent = false;
                    $('#colPlayer' + currentElemPlayerIndex).collapsible('expand'); 
                }
                else{
                    //Focus ist auf Name des erster Spielers, scroll to AddButton (index -1)
                    if(currentElemPlayerIndex == 0 && currentElemIndex == -1){
                        currentElement = $('#addButton');
                        currentElemIndex--;
                        currentElemPlayerIndex--;
                        console.log('addbutton');
                    }
                    else{
                        if(currentElemPlayerIndex == -1 && currentElemIndex == -2){
                            currentElemIndex--;
                            currentElement = $('#h01_1');
                            console.log('titel');
                        }
                    }
                }
            }         
        }        
        console.log('player: ' + currentElemPlayerIndex + ' index: ' + currentElemIndex + ' last' );
        //Animation & Focus. If Input, set Focus, do Animation
        if(currentElemIndex == 0 || currentElemIndex == 1){
            $('#colPlayer' + currentElemPlayerIndex).find('input').eq(currentElemIndex).focus();
        }    
        $('html, body').animate({
            scrollTop: currentElement.offset().top
        }, scrollSpeed * 0.7);            
    });

    $(document).on('click', '#nextBtn', function () {
        if(currentElement.parents().is('.ui-collapsible-collapsed')){
            doCollapsibleEvent = false;
            currentElement.parents('.ui-collapsible-collapsed').collapsible('expand');
        }
        //Titel oder addbutton, also PlayerIndex -1
        if(currentElemPlayerIndex == -1){
            //vom Titel nach unten zum Button
            if(currentElemIndex == -3){
                currentElement = $('#addButton');
                currentElemIndex++;              
            }
            //zum ersten Spieler zum Namen
            else{                
                /*
                currentElemIndex++; 
                currentElemPlayerIndex++;
                currentElement = $('#colPlayer0');
                */
                currentElemIndex = 0;
                currentElemPlayerIndex = 0;
                currentElement = $('#colPlayer' + currentElemPlayerIndex).find('label').eq(currentElemIndex);
                $('html, body').animate({
                    scrollTop: $('#colPlayer0').offset().top
                }, scrollSpeed * 0.7);
                if(currentElement.parents().is('.ui-collapsible-collapsed')){
                    doCollapsibleEvent = false;
                    currentElement.parents('.ui-collapsible-collapsed').collapsible('expand');
                }
            }
        }
        //Auf einem Spieler
        else{
            //nicht am Ende  
            if(currentElemIndex < 2){
                currentElemIndex++;  
                currentElement = $('#colPlayer' + currentElemPlayerIndex).find('label').eq(currentElemIndex);               
            }
            else{
                //am Ende, nächster Spieler, weitersetzen auf Namen
                //else ganz am Ende, mache nichts
                if(currentElemPlayerIndex < playerCount){       
                    currentElemPlayerIndex++; 
                    currentElemIndex = 0;                    
                    currentElement = $('#colPlayer' + currentElemPlayerIndex).find('label').eq(currentElemIndex);
                    //$('html, body').animate({
                     //   scrollTop: $('#colPlayer' + (currentElemPlayerIndex-1)).offset().top
                   // }, scrollSpeed * 2);                    
                    $('#colPlayer' + currentElemPlayerIndex).collapsible('expand');                                                     
                }
            }
        }
        
        console.log('player: ' + currentElemPlayerIndex + ' index: ' + currentElemIndex + ' next' );
        //Animation & Focus. If Input, set Focus, do Animation
        if(currentElemIndex == 0 || currentElemIndex == 1){
            $('#colPlayer' + currentElemPlayerIndex).find('input').eq(currentElemIndex).focus();
        }    
        $('html, body').animate({
            scrollTop: currentElement.offset().top
        }, scrollSpeed * 0.7);
    });
    
        
    $(document).on( 'collapsibleexpand', '.colPlayerclass' , function( event, ui ) {
        if(doCollapsibleEvent){
            console.log('event expand');
            deleteId = $(this).attr('id');
            deleteId = deleteId.substr(deleteId.length - 1);
            currentElemPlayerIndex = deleteId * 1;
            currentElemIndex = 0;
            currentElement = $(this);
            //$('html, body').animate({
            //    scrollTop: currentElement.offset().top
            //}, scrollSpeed);
            currentElement = $(this).find('label').eq(currentElemIndex);
            $('html, body').animate({
                scrollTop: currentElement.offset().top
            }, scrollSpeed);
        }
        doCollapsibleEvent = true;
    });

    $(document).on( 'focus', 'input' , function( event, ui ) {
        console.log("FOCUS" + $(this).attr('id'));
        if(currentElemPlayerIndex < 0){
            currentElemPlayerIndex = 0;
        }
        if($(this).attr('id') == 'name'){
            currentElemIndex = 0;            
        }
        else if ($(this).attr('id') == 'weight'){
            currentElemIndex = 1;
        }
    });


    //$('#h01_1').html('Saufomat');//test, jQuery running, syntax error
}



//decrease all elements ids after the deleted element by 1     //alert('deleteId '+deletedId+'playerCount'+playerCount);
function updateColplayerId(deletedId) {
    for (var i = deletedId * 1 + 1; i < playerCount + 1; i++) {
        $('#colPlayer' + i).attr('id', 'colPlayer' + (i - 1));
    }
    playerCount--;
}

function checkPlayerNames() {
    var errorMessage = '';
    var i = 0;
    var j = 1;
    var match = false;
    var playerControlVar = $('#colPlayer' + 0).find('input');

    for (i = 0; i < playerCount + 1; i++) {
        if (playerControlVar.eq(0).val() == '' || playerControlVar.eq(0).val() == null) {
            match = true;
            errorMessage += 'Für Spieler ' + (i + 1) + ' wurde kein Name eingegeben!' + '<br>';
        }
        if (playerControlVar.eq(1).val() == '' || playerControlVar.eq(1).val() == null) {
            match = true;
            playerControlVar.eq(1).val(70);
            errorMessage += 'Spieler ' + (i + 1) + ' hat kein Gewicht angegeben, zurückgesetzt auf 70!' + '<br>';
        }
        playerControlVar = $('#colPlayer' + (i + 1)).find('input');
    }
    i = 0;
    j = 1;
    playerControlVar = $('#colPlayer' + 0).find('input').eq(0).val();

    for (; j < playerCount + 2; j++) {
        for (i = i + j; i < playerCount + 1; i++) {
            //alert($('#colPlayer'+i).find('input').eq(0).val());
            if (playerControlVar == $('#colPlayer' + i).find('input').eq(0).val()) {
                match = true;
                if (!(playerControlVar == '' || playerControlVar == null)) {
                    //alert('Der Spielername \"'+ $('#colPlayer'+i).find('input').eq(0).val() + '\" wird mehr als einmal verwendet!');
                    //return 'Der Spielername \"'+ $('#colPlayer'+i).find('input').eq(0).val() + '\" wird mehr als einmal verwendet!';
                    errorMessage += 'Der Spielername \"' + $('#colPlayer' + i).find('input').eq(0).val() + '\" wird mehr als einmal verwendet!' + '<br>';
                }
            }
        }
        i = 0;
        playerControlVar = $('#colPlayer' + (j)).find('input').eq(0).val();
    }
    if (match == true) {
        //alert(errorMessage);
        $('#popup').children('p').html(errorMessage);
        $('#popup').popup('open', {
            transition: 'slidefade',
            positionTo: 'origin'
        });
        return false;
    }
    return true;
}
