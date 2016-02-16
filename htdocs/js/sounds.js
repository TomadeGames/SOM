var isMuted = false;
var my_media = null;
var mediaTimer = null;

function playAudio(src) {
    if (isSmartphone && !isMuted) {
        // Create Media object from src
        my_media = new Media(src, onSuccess, onError);

        // Play audio
        my_media.play();

        // Update my_media position every second
        if (mediaTimer == null) {
            mediaTimer = setInterval(function () {
                // get my_media position
                my_media.getCurrentPosition(
                    // success callback
                    function (position) {
                        if (position > -1) {
                            setAudioPosition((position) + " sec");
                        }
                    },
                    // error callback
                    function (e) {
                        console.log("Error getting pos=" + e);
                        setAudioPosition("Error: " + e);
                    }
                );
            }, 1000);
        }
    }
}

function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

// onSuccess Callback
function onSuccess() {
    console.log("playAudio():Audio Success");
}
// onError Callback
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}