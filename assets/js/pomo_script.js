var pomoCount = 0;

var workLength = 25 * 60; // 25 minutes
var breakLength = 5 * 60; // 5 minutes
var longBreakLength = 15 * 60; // 15 minutes

// test
// var workLength = 3; // 25 minutes
// var breakLength = 3; // 5 minutes
// var longBreakLength = 3; // 15 minutes

var maxTime = workLength;
var currTime = 0;
var isEndOfBreak = false;
var isBreak = false;
var currFormattedTime = str_pad_left(secondsToMinutes(),'0',2) + ':' + 
                          str_pad_left(secondsToSeconds(),'0',2);

$(document).ready(function(){
  $("#ding").click(function() {
    playSound("assets/audio/oneMinuteRemaining.wav");
  });

  $("#start-button").click(function() {
    startPomo();
  });

  $("#rest-text").click(function() {
    startPomo();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 13 && (isEndOfBreak || $("#intro").is(":visible"))) {
      // ENTER
      startPomo();
      isEndOfBreak = false;
    }
    if (e.keyCode == 27) {
      // ESC
      endPomo();
      isEndOfBreak = false;
    }
  });
});

function startPomo() {
  $("#alert-text").fadeOut(1000); 
  $("#rest-text").fadeOut(1000); 
  $("#pomocount-text").text(pomoCount + 1);
  $("#pomocount-text").fadeIn(1000);
  isBreak = false;
  if ($("#intro").is(":visible")) {
    $("#intro").hide();
  }

  playSound("assets/audio/startWork.wav");
  $("#pomo").fadeIn(1000);
  $("#pomo").css({"background-color": "#42A5F5",
              "width": "300px",
              "height": "300px",
              "margin": "-150px 0 0 -150px",
              "border-radius": "15px"});
  maxTime = workLength;
  counter = setInterval(timer, 1000);
}

function endPomo() {
  clearInterval(counter);
  currTime = 0;
  isBreak = false;
  currFormattedTime = str_pad_left(secondsToMinutes(),'0',2) + ':' + 
                          str_pad_left(secondsToSeconds(),'0',2);
  $("#timer").text(currFormattedTime);
  $("#pomo").css({"background-color": "",
              "width": "",
              "height": "",
              "border-radius": ""});
  $("#pomo").hide();
  $("#intro").fadeIn(1000);
}

function startBreak() {
  isBreak = true;
  playSound("assets/audio/startRest.wav");
  $("#pomo").css({"background-color": "#42f593",
                "border-radius": "50%",
                "width": "400px",
                "height": "400px",
                "margin": "-200px 0 0 -200px"});
  maxTime = breakLength;
  counter = setInterval(timer, 1000);
}

function startLongBreak() {
  isBreak = true;
  playSound("assets/audio/startRest.wav");
  $("#pomo").css({"background-color": "#72f542",
                "border-radius": "50%",
                "width": "500px",
                "height": "500px",
                "margin": "-250px 0 0 -250px"});
  maxTime = longBreakLength;
  counter = setInterval(timer, 1000);
}

function timer() {
  currFormattedTime = str_pad_left(secondsToMinutes(),'0',2) + ':' + 
                          str_pad_left(secondsToSeconds(),'0',2);
  $("#timer").text(currFormattedTime);
  currTime = currTime + 1;

  if (currTime <= maxTime - 59 && currTime >= maxTime - 61) {
    // 1 minute left
    playSound("assets/audio/oneMinuteRemaining.wav");
  }

  // display 1 minute alert
  if (currTime == maxTime - 62) {
    $("#alert-text").text("1 minute remaining");
    $("#alert-text").fadeIn(1000);
  }
  if (currTime == maxTime - 58) {
    $("#alert-text").fadeOut(1000);
  }

  if (currTime > maxTime) {
    clearInterval(counter);
    currTime = 0;

    if (isBreak) {
      // end of break => prompt for enter/esc
      isEndOfBreak = true;
      playSound("assets/audio/startWork.wav");
      $("#alert-text").text("Press ENTER to continue");
      $("#alert-text").fadeIn(1000);
      $("#rest-text").fadeIn(1000);
    } else {
      // end of pomo => autostart break
      $("#pomocount-text").fadeOut(1000);
      pomoCount = pomoCount + 1;
      if (pomoCount == 4) {
        pomoCount = 0;
        startLongBreak();
      } else {
        startBreak();
      }
    }
  }
}

function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

function secondsToMinutes() {
  return Math.floor(currTime / 60);
}

function secondsToSeconds() {
  return currTime - (secondsToMinutes() * 60);
}

function playSound(sound) {
  var snd = new Audio(sound);
  snd.play();
}
