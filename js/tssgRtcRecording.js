// Title: Fork and Record WebRTC (main.js JavaScript component)
// Author: Michael Kugel (mkugel@tssg.org)
// Date: 30th June 2014
// Version 0.1.0
//
// Copyright (c) 2014, WATERFORD INSTITUTE OF TECHNOLOGY (TSSG)
//
// All rights reserved.
//
// This project is making use of RecordRTC by Muaz Khan under MIT licence and other sub-projects with their licences.
// The code inside tssgRtcRecording.js was develped by Michael Kugel (3MT, TSSG, WIT) (c) 2014
// This is a demo for WebRTC audio and video stream recording and replay. Main focus on using Google Chrome (see: WebRTC codelab).
// Some experimental code is added for firefox and the use of STUN/TURN server technology for ICE (not complete).
// If you need clarification or want to use any part of this code, please contact mkugel@tssg.org.

// Video and Audio Recording (using RecordRTC)

var recordButton = document.getElementById("recordButton");
var stopRecordingButton = document.getElementById("stopRecordingButton");
var stopPCButton = document.getElementById("stopPCButton");
var recordAudioButton = document.getElementById("recordAudioButton");
var stopRecordingAudioButton = document.getElementById("stopRecordingAudioButton");
var startRecordingAudioAndVideoButton = document.getElementById("startRecordingAudioAndVideoButton");
var stopRecordingAudioAndVideoButton = document.getElementById("stopRecordingAudioAndVideoButton");
var startRecordingAudioAndVideoChromeButton = document.getElementById("startRecordingAudioAndVideoChromeButton");
var stopRecordingAudioAndVideoChromeButton = document.getElementById("stopRecordingAudioAndVideoChromeButton");
var replayConversationButton = document.getElementById("replayConversationButton");

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var recordedVideo = document.querySelector('#recordedVideo');
var recordedVideo2 = document.querySelector('#recordedVideo2');
var audio1 = document.querySelector('#audio1');
var audio2 = document.querySelector('#audio2');

var localStream;
var remoteStream;
var recordRTC;
var recordRTC2;
var audioStream;
var remoteAudioStream;
var recorder;
var remoteRecorder;

var audioConstraints = {
    audio: true,
    video: false
};

function detectBrowser() {
    var N= navigator.appName, ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]:[N, navigator.appVersion, '-?'];
    return M.join(' ');
    };

function activateFeatures() {
    var browser = detectBrowser();
    console.log(browser.substring(0,6));
    if (browser.substring(0,6) == "Chrome" || browser.substring(0,7) == "Firefox") {
        console.log("You are good to go with WebRTC");
    }
    else {
        console.log("You seem to need a plugin to run the recording demo");
    }
}

function addEventListeners() {
    
    activateFeatures();
    
    console.log("Adding Event Listeneners");
    console.log("navigator.userAgent is: " + navigator.appCodeName);

    recordButton.onclick = recordRemoteVideo;
    stopRecordingButton.onclick = stopRecordingRemoteVideo;
    stopPCButton.onclick = stop;
    //startRecordingAudioAndVideoButton.onclick = startRecordingAudioAndVideo;
    //stopRecordingAudioAndVideoButton.onclick = stopRecordingAudioAndVideo;
    recordAudioButton.onclick = recordAudio;
    stopRecordingAudioButton.onclick = stopRecordingAudio;
    startRecordingAudioAndVideoChromeButton.onclick = startRecordingAudioAndVideoChrome;
    stopRecordingAudioAndVideoChromeButton.onclick = stopRecordingAudioAndVideoChrome;
    replayConversationButton.onclick = replayConversation;

}

function recordLocalVideo() {
    var options = {
        type: 'video',
        video: {
            width: 440,
            height: 230
        },
        canvas: {
            width: 440,
            height: 230
        }
    };
    recordRTC = RecordRTC(localStream, options);
    recordRTC.startRecording();
}

function recordRemoteVideo() {
    var options = {
        type: 'video',
        video: {
            width: 440,
            height: 230
        },
        canvas: {
            width: 440,
            height: 230
        }
    };
    
    recordRTC2 = RecordRTC(remoteStream, options);
    recordRTC2.startRecording();
}

function stopRecordingLocalVideo() {
    var videoURL = "blob:http://localhost" // not the right URL, needs revisiting! _mk_
    recordRTC.stopRecording(function(videoURL) {
        recordedVideo.src = videoURL;
    });
}

function stopRecordingRemoteVideo() {
    var videoURL = "blob:http://localhost" // not the right URL, needs revisiting! _mk_
    recordRTC2.stopRecording(function(videoURL) {
        recordedVideo2.src = videoURL;
    });
}

function recordAudio() {
    if (!audioStream)
        navigator.getUserMedia(audioConstraints, function(localStream) {
            if (window.IsChrome) localStream = new window.MediaStream(localStream.getAudioTracks());
            audioStream = localStream;
            audio1.src = URL.createObjectURL(audioStream);
            audio1.muted = true;
            audio1.play();
            recorder = window.RecordRTC(localStream, {
                type: 'audio'
            });
            recorder.startRecording();
        }, function() {
        });
    else {
        audio1.src = URL.createObjectURL(audioStream);
        audio1.muted = true;
        audio1.play();
        if (recorder) recorder.startRecording();
    }
    window.isAudio = true;
}

function recordRemoteAudio() {
    if (!remoteAudioStream)
        navigator.getUserMedia(audioConstraints, function(remoteStream) {
            if (window.IsChrome) remoteStream = new window.MediaStream(remoteStream.getAudioTracks());
            remoteAudioStream = remoteStream;
            audio2.src = URL.createObjectURL(remoteAudioStream);
            audio2.muted = true;
            audio2.play();
            remoteRecorder = window.RecordRTC(remoteStream, {
                type: 'audio'
            });
            //var remoteRecorder = new RecordRTC({ stream: remoteStream
            //                                   });
            //remoteRecorder.recordAudio();
            remoteRecorder.startRecording();
        }, function() {
        });
    else {
        audio2.src = URL.createObjectURL(remoteAudioStream);
        audio2.muted = true;
        audio2.play();
        if (remoteRecorder) remoteRecorder.startRecording();
    }
    window.isAudio = true;
}

function stopRecordingAudio() {
    
    audio1.src = '';
    if (recorder) {
        //var audioURL = "blob:http://10.37.3.53"
        recorder.stopRecording(function(url) {
        //recorder.stopRecording(function(audioUrl) {
            audio1.src = url;
            audio1.muted = false;
            //audio1.play();
            //document.getElementById('audio-url-preview').innerHTML = '<a href="' + url + '" target="_blank">Recorded Audio URL</a>';
        });
    }
}

function stopRecordingRemoteAudio() {

    audio2.src = '';
    if (remoteRecorder) {
        //var audioURL = "blob:http://10.37.3.53"
        remoteRecorder.stopRecording(function(url) {
        //remoteRecorder.stopRecording(function(audioUrl) {
            audio2.src = url;
            audio2.muted = false;
            //audio2.play();
            //document.getElementById('audio-url-preview').innerHTML = '<a href="' + url + '" target="_blank">Recorded Audio URL</a>';
        });
    }
}

// For Firefox

//function captureUserMedia(callback) {
//    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
//    navigator.getUserMedia({ audio: true, video: true }, function(remoteStream) {
//        audioAndVideo1.src = URL.createObjectURL(remoteStream);
//        callback(remoteStream);
//    }, function(error) { console.error(error); });
//}

//function startRecordingAudioAndVideo() {
//
//    // For Firefox
//    
//    captureUserMedia(function(remoteStream) {
//        window.audioVideoRecorder = window.RecordRTC(remoteStream, {
//            type: 'video'
//        });
//        window.audioVideoRecorder.startRecording();
//    });
//}
//
//function stopRecordingAudioAndVideo() {
//
//    // For Firefox
//    
//    window.audioVideoRecorder.stopRecording(function(url) {
//        //downloadURL.innerHTML = '<a href="' + url + '" download="RecordRTC.webm" target="_blank">Save RecordRTC.webm to Disk!</a>';
//        audioAndVideo1.src = url;
//    });
//}

function asyncDelayed(fn, callback) {
    setTimeout(function() {
        fn();
        callback();
    }, 250);
}

function async(fn, callback) {
    setTimeout(function() {
        fn();
        callback();
    }, 0);
}

function replayConversation() {
    audio1.play(0);
    audio2.play(0);
    recordedVideo.play(0);
    recordedVideo2.play(0);
    //async(audio1.play(0), recordedVideo.play(0));
    //async(audio2.play(0), recordedVideo2.play(0));
}

function startRecordingAudioAndVideoChrome() {
    
    //recordLocalVideo();
    //recordRemoteVideo();
    asyncDelayed(recordAudio, recordLocalVideo);
    
    //recordAudio();
    //recordRemoteAudio();
    asyncDelayed(recordRemoteAudio, recordRemoteVideo);
}

function stopRecordingAudioAndVideoChrome() {
    
    //stopRecordingLocalVideo();
    //stopRecordingRemoteVideo();
    //stopRecordingAudio();
    //stopRecordingRemoteAudio();
    async(stopRecordingLocalVideo, stopRecordingAudio);
    async(stopRecordingRemoteVideo, stopRecordingRemoteAudio);
}
