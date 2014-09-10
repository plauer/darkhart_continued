Rails.application.routes.draw do
  # new game form
  post 'api/games' => 'api/games#new_game'
  # previous round recap
  get "/api/games/:game_id/rounds/:round_num" => 'api/games#game_state'
  # current game state
  get "/api/games/:game_id" => 'api/games#game_state'
  # makesubmission
  get "/api/games/:game_id/cards/:card_id" => 'api/games#submit_card'
  # make decision
  post "/api/games/:game_id/round/:round_id" => 'api/games#submit_card'

  get "/api/users/:user_id" => 'api/games#inventory'

  get '/tool' => "devtool#index"
  root 'devtool#index'

  # get 'api/users/:user_id' => 'application#user_state' # Returns all games the user is in.
  # post 'api/users/:user_id/games' => 'application#new_game' # Creates new game and returns game_state

  # get 'api/users/:user_id/games/:game_id' => 'application#game_state'
  # get 'api/users/:user_id/games/:game_id/rounds/:round' => 'application#game_state'

  # get 'api/users/:user_id/games/:game_id/cards/:card_id' => 'application#submit_card' # GET FOR TESTING ONLY

  # post 'api/users/signin' => 'users#signin'
end
