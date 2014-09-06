get '/api/users/:user_id' => 'application#xxx' # List of all games user is in.

# View sends ...
{ authentication: [user_id] }

# Server responds...
{ open_games: [ { game_id: 1,
                  game_name: "name",
                  current_round: 1,
                  total_rounds: 10,
                  players: [{player_name: "name", player_score: 1 }]
                  } ] }

post '/api/users/:user_id' => 'application#xxx' # Create a new user

# NOT MVP

get '/api/games/:game_id' => 'application#active_games' # Returns status of a game

{ authentication: [user_id], game_id: 1 }



post '/api/games/:game_id' => 'application#xxx' # Creates new game


get '/api/games/:game_id/rounds/current => 'application#get_current_round' # Round data
View sends in ...
{ authentication: [user_id], game_id: 1 }

get '/api/games/:game_id/rounds/:id => 'application#get_round' # Round data

View sends ...
{ authentication: [user_id], game_id: 1, round: 1 }

#SERVER ALWAYS INCLUDES:
  round: 1,
  active: false,
  player_self: {name: "name",
                score: 1, id: 1,
                cards: [ { playable_card_id: 1, content: "Sentence" } ] }

#if you are a player:
{ leader: { leader?: false, blackcard_content: "Sentence" }
  players: [{player_name: "name", player_id: 1, submitted: true/false}]
  submission: { submitted?: true, submission_id: 5 } # if submitted is true
}

#if you are a leader:
{ leader: { leader?: true, blackcard_content: "Sentence" }
  submissions: [{ submitted?: true, player_name: "name", player_score: 1, submission_id: 1, submission_content: "Sentence"},
                { submitted?: false, player_name: "name", player_score: 1 }] }

#if recap ...
{ leader: { leader?: true, blackcard_content: "Sentence" }
  losing_submissions: [{ player_name: "name", player_score: 1, submission_id: 1, submission_content: "Sentence" }]
  winning_submission: { player_name: "name", player_score: 1, submission_id: 1, submission_content: "Sentence" }
}





put '/api/games/:game_id/rounds/:round_id' => 'application#submit_card' # Send in chosen card

