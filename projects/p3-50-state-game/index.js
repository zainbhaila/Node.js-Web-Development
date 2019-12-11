// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
let states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];
var states_lower = {} // create a mapping of lowercase state names to proper
for (let i of states) {
  states_lower[i.toLowerCase()] = i
}
var correct = [] // correctly guessed states
let start_time = 0
let inter

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
let abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}

function start() {
  $("#state_input").attr("disabled", false) // disable start
  $("#start_button").attr("disabled", true) // enable input
  correct = [] // reset correct
  $(".lists").empty() // reset correct
  $("#dialog").dialog("close") // close winning dialog
  $("#dialogL").dialog("close") // close losing dialog
  start_time = new Date
  $("#clock").html(20)
  inter = setInterval(function() { // set 20 second timer
      $("#clock").html(20 - Math.round((new Date - start_time) / 1000))
      if (20 - Math.round((new Date - start_time) / 1000) <= 0) {
        clearInterval(inter)
        $("#state_input").attr("disabled", true) // disable input
        $("#start_button").attr("disabled", false) // enable start
        $("#score").html("Score: " + correct.length + "/" + states.length)
        let missed = states.filter(x => !correct.includes(x)) // get all states not guessed
        for (let i of missed) { // output all missed states
          $("#list_incorrect").append("<p id=" + i + ">" + i + "</p>") // add state to displayed list
        }
        $("#dialogL").dialog("open") // losing dialog
      }
  }, 1000);
}

function changed() { // when the input is changed, check whether a state is matched
  let exists = states_lower[$("#state_input").val().toLowerCase()] // ignore case
  if (exists != undefined && !correct.includes(exists)) { // if state is valid and not already guessed
    correct.push(exists) // store correct state
    $("#state_input").val("") // reset input
    $("#list_correct").append("<p id=" + exists + ">" + exists + "</p>") // add state to displayed list
    if (correct.length === states.length) { // if all states are guessed
      $("#state_input").attr("disabled", true) // disable input
      $("#start_button").attr("disabled", false) // enable start
      $("#dialog").dialog("open") // winning dialog
      clearInterval(inter)
    }
  }
}

$(".lists").on("mouseover", "p", function() { // on hover, display population
  let state_pop = 0 // store state population
  $.ajaxSetup({async: false}) // force query to finish before continuing
  $.get("https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:" + // population query
      abvMap[$(this).html().split("-")[0]] + "&LAN=625", function(data) {
    state_pop = data[1][0] // get state population
  })
  $(this).html($(this).html().split("-")[0] + "-" + Number(state_pop).toLocaleString()) // change html to display population next to name
  $.ajaxSetup({async: true}) // revert query settings
})
$(".lists").on("mouseout", "p", function() { // no longer hovering over name, remove population
  $(this).html($(this).html().split("-")[0]) // remove population from name
})

/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
