// globals
var APP;

function initVideo() {
    try {
        document.getElementById('video').bindToCurrentChannel();
    } catch (e) {
        console.log("ERROR: ", e);
    }
    try {
        document.getElementById('video').setFullScreen(false);
    } catch (e) {
        console.log("ERROR: ", e);
    }
}

function initApp() {
    try {
        APP = document.getElementById('oipfAppMan').getOwnerApplication(document);
        APP.show();
        //APP.activate();
    } catch (e) {
        console.log("ERROR: ", e);
    }

    // set keyset: red + green + yellow + blue + navigation + numeric
    setKeyset(0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x100);

    // show video broadcast
    showVideo(false);

    // set focus
    //document.getElementById("start").focus();
}

function closeApp() {
    try {
        APP.destroyApplication();
        return;
    } catch (e) {
        console.log("ERROR: ", e);
    }
}

function setKeyset(mask) {
    // for HbbTV 0.5:
    try {
        var elemcfg = document.getElementById('oipfConfig');
        elemcfg.keyset.value = mask;
    } catch (e) {
        // ignore
    }
    try {
        var elemcfg = document.getElementById('oipfConfig');
        elemcfg.keyset.setValue(mask);
    } catch (e) {
        // ignore
    }
    // for HbbTV 1.0:
    try {
        APP.privateData.keyset.setValue(mask);
        APP.privateData.keyset.value = mask;
    } catch (e) {
        // ignore
    }
}
function showVideo(typ) {
    var elem = document.getElementById('video-container');
    var oldvid = document.getElementById('video');
    try {
        oldvid.stop();
    } catch (e) {
        // ignore
    }
    try {
        oldvid.release();
    } catch (e) {
        // ignore
    }
    var mtype = typ ? 'video/mp4' : 'video/broadcast';
    var ihtml = '<object id="video" type="'+mtype+'" style="position: absolute; left: 0px; top: 0px; width: 1280px; height: 720px;""><'+'/object>';
    elem.style.left = '0px';
    elem.style.top = '0px';
    elem.style.width = '1280px';
    elem.style.height = '720px';
    elem.innerHTML = ihtml;
    var succss = false;
    var phase = 1;
    try {
        var videlem = document.getElementById('video');
        if (videlem) {
            if (typ) {
                phase = 2;
                videlem.data = '../assets/videos/'+stringVideoBroadband+'.mp4';
                phase = 3;
                videlem.play(1);
                succss = true;
            } else {
                phase = 4;
                videlem.bindToCurrentChannel();
                succss = true;
            }
        }
    } catch (e) {
        // failed
        console.log("ERROR: ", e);
    }

    fullscreen = false;
    try {
        videlem.setFullscreen(false);
    } catch (e) {
        // ignore
    }
}

function setSpeed(fact) {
    try {
        var vid = document.getElementById('video');
        vid.play(fact);
        setTimeout(function() {checkPlaySpeed(fact);}, 1000);
    } catch (e) {
        console.log("Cannot set playback speed to " + fact);
        console.log("ERROR: ", e);
    }
}

function checkPlaySpeed(fact) {
    var vid = document.getElementById('video');
    if (vid.playState === 3 || vid.playState === 4) {
        console.log("Still buffering: waiting to check reported playback speed...");
        setTimeout(function() {checkPlaySpeed(fact);}, 1000);
        return;
    }
    if (parseInt(fact)==parseInt(vid.speed)) {
        console.log("Video playback speed should now be " + fact);
    } else {
        var addmsg = (fact == 0 || fact == 1) ? '' : '. Note: test is OK even though this test failed, as feature is not mandatory.';
        console.log("Setting speed succeeded, but reported speed is " + vid.speed + addmsg);
    }
}