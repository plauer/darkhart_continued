// ------------ GLOBAL -----------
$.cookie.json = true;

// $(document).bind("mobileinit", function()
// {
//     $.mobile.page.prototype.options.domCache = false;
//     $.mobile.ajaxEnabled = true;
//     $.mobile.changePage.defaults.reloadPage = true;
// });

var bindClearCookie = function($el) {
  $el.on("click", function(event) {
    console.log("Running bindClearCookie event");
    $.removeCookie('session');
    // $("#user").trigger("create");
    location.reload();
  });
};

var bindSetCookie = function($submit, $user_id, $game_ids) {
  $submit.on("click", function(event) {
    console.log("Running bindSetCookie event");
    var game_ids = $game_ids.val().split(",");
    for (var a in game_ids ) { game_ids[a] = parseInt(game_ids[a], 10); }
    var cookie = { "user_id": $user_id.val(),
                   "game_ids": game_ids };
    $.cookie('session', cookie);
    // $("#user").trigger("create");
    setTimeout(
      function(){
        location.reload();
      },100
    );
  });
};

// Partials

// var html_logout = $("<a href='#user' class='ui-btn user_logout'>Logout</a>");

// var html_login = "<a href='#create_account' class='ui-btn'>Create Account</a>" +
//                 "<a href='#login' class='ui-btn'>Login</a>";

// success:function(result){
//     $("#tab7 form").after(html);
//     $('#add-notes-form textarea').attr('value','');
// }


// -------------- HOME -----------------
// Home partials




// Home on load
$( document ).delegate("#user", "pageinit", function() {
  console.log("INIT RUNNING!")
  $('#user').trigger('create')
  cookie = $.cookie('session');
  bindSetCookie( $("#cookie-submit"),$("#cookie-user-id"),$("#cookie-game-ids") );
  bindClearCookie( $("#cookie-clear") );
  bindClearCookie( $(".user-logout") );
  if (cookie) {
    console.log("Detected cookie.")
    $(".login").hide();
    $(".create-account").hide();
    $(".user-logout").show();

  }
  else {
    console.log("No cookie tected.")
    $(".login").show();
    $(".create-account").show();
    $(".user-logout").hide();
  }
});

//SETUP games for users

// }

var GameState = function(user_id, game_ids) {
  this.user_id = user_id
  this.game_ids = game_ids
  this.games = [];
  // this.getGames();
};

GameState.prototype = {
    // getGames: function() {
    //     $.ajax({
    //       type: "GET",
    //       url: "api/users/" + this.user_id + "/games/" + value,
    //       data: "whatever"})
    //     .done( function(data) {
    //
    //     })


    //   }.bind(this))
    // }
}

new GameState(1,[1])

// function drawGames(game_objects) {


// }






















//MODELS
var PlayableCard = function(object) {
  this.id = object.id;
  this.content = object.content;
}

var User = function(object) {
  this.user_id = object.user_id;
  this.seat_id = object.seat_id;
  this.name = object.player_name;
  this.score = object.player_score;
  this.email = object.player_email;
  this.playable_cards = []
  for( var i = 0; i < object.player_cards.length; i++) {
    playable_card = new PlayableCard(object.player_cards[i])
    this.playable_cards.push(playable_card)
  };
}

var Game = function(object) {
  this.game_id = object.game_id
  this.round = new Round(object)
  this.active = object.active
}

var Round = function(object) {
  this.round_num = object.round;
  this.submissions = object.submissions;
  this.missing_submissions = object.missing_submissions;
  this.winning_submission = object.winning_submission;
  this.losing_submissions = object.losing_submissions;
}

var Leader = function(object) {
  this.name = object.leader_name
  this.user_id = object.leader_user_id
  this.email = object.leader_email
  this.seat_id = object.leader_seat_id
  this.blackcard = new Blackcard(object)
}

var Blackcard = function(object) {
  this.content = object.blackcard_content
}

//CONTROLLER


$(document).ready(function() {
  var controller = new Controller
});


var Controller = function() {
  this.bindEvents();
};

Controller.prototype = {

  parseAjaxResponse: function(data) {
    user = new User(data.player_self)
    game = new Game(data)
    leader = new Leader(data.leader)
  },

  createGame: function(event) {
    event.preventDefault();
    var form = $(event.target);
    initiator_id = form.find( "input[name='initiator_id']" ).val();
    invite_ids = form.find( "input[name='invite_ids']" ).val();
    game_name = form.find( "input[name='game_name']" ).val();
    url = "/api/users/" + initiator_id + "/games";

    var posting = $.post( url, { "invite_ids": invite_ids,
                                  "game_name": game_name } );
    posting.done(function( data ) {
      $("#json").empty().append(JSON.stringify(data, undefined, 2))
      console.log(data);
      this.parseAjaxResponse(data)
    }.bind(this));
  },

  getPreviousRoundRecap: function(event) {
    event.preventDefault();
    var form = $(event.target);
    initiator_id = form.find( "input[name='initiator_id']" ).val();
    game_id=  form.find( "input[name='game_id']" ).val();
    round_num = form.find( "input[name='round_num']").val();
    url = "/api/users/" + initiator_id + "/games/" + game_id + "/rounds/" + round_num;

    var posting = $.get(url);
    posting.done(function( data ) {
      $("#json").empty().append(JSON.stringify(data, undefined, 2))
      console.log(data);
      this.parseAjaxResponse(data)
    }.bind(this));

  },

  getCurrentGameState: function(event) {
    var form = $(event.target);
    initiator_id = $.cookie('session').user_id
    game_id = $.cookie('session').game_ids[0]
    url = "/api/users/" + initiator_id + "/games/" + game_id;
    var posting = $.get( url);
    posting.done(function( data ) {
      console.log(data);
      this.parseAjaxResponse(data)
    }.bind(this));
  },

  makeSubmission: function(event) {
    event.preventDefault();
    var form = $(event.target);
    initiator_id = form.find( "input[name='initiator_id']" ).val();
    game_id = form.find( "input[name='game_id']" ).val();
    card_id = form.find( "input[name='card_id']" ).val();
    url = "/api/users/" + initiator_id + "/games/" + game_id + "/cards/" + card_id;
    var posting = $.get(url);

    posting.done(function( data ) {
      $("#json").empty().append(JSON.stringify(data, undefined, 2))
      console.log(data);
      this.parseAjaxResponse(data)
    }.bind(this));
  },

  bindEvents: function() {
    $("#newGameForm").on("submit", this.createGame.bind(this))
    $("#previousRoundRecap").on("submit", this.getPreviousRoundRecap.bind(this))
    $("#game1").on("click", this.getCurrentGameState.bind(this))
    $("#makeSubmission").on("submit", this.makeSubmission.bind(this))
  }
}

