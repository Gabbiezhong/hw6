/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    setEyeColor(listeningEyeColor);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      setEyeColor(normalEyeColor);

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
      setEyeColor(curEyeColor);
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    var play_re = /(play|sing)\s(.+)/  // creating a regular expression
    user_said = user_said.toLowerCase();
    var play_parse_array = user_said.match(play_re)
    var acceptable_singers= ["coldplay", "abc", "little mix","eminem"]; 
    var acceptable_songs= ["yellow", "lose yourself", "the scientist", "shout out to my ex"];
    var acceptable_songlist =["pop song", "my songlist", "rock songs"]
    if (play_parse_array && state === "initial" && (acceptable_singers.indexOf(play_parse_array[2]) != -1 || acceptable_songs.indexOf(play_parse_array[2]) != -1 || acceptable_songlist.indexOf(play_parse_array[2]) != -1)) {
      response = "ok, playing " + play_parse_array[2];
    } else if (user_said.toLowerCase().includes("play") && state === "initial") {
      response = "Play what?";
      state = "play_song"
    } else if (user_said.toLowerCase().includes("bye")) {
      response = "good bye to you!";
      state = "initial"
    } else if (state === "play_song") {
      response = "ok, playing " + user_said;
      state = "initial"
    } else {
      response = "i don't get it";
    }
    return response;
  }

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
