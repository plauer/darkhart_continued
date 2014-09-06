class GameSkeleton
  attr_reader :new_game

  def initialize(name="default", user_ids, number_of_rounds)
    @new_game = Game.create(name: name)
    @game_users = user_ids.map { |user_id| user = User.find_by_id(user_id) }
    populate_seats
    deal_cards_to_seats
    make_rounds(number_of_rounds)
    return @new_game.id
  end

  private

  def populate_seats()
    @game_users.each do |user|
      user.seats << Seat.create(game_id: @new_game.id)
      user.save
    end
  end

  def deal_cards_to_seats()
    @new_game.seats.each do |seat|
      10.times do
        PlayableCard.create(seat_id: seat.id, whitecard_id: random_whitecard.id)
      end
    end
  end

  def make_rounds(number_of_rounds)
    user_array = @new_game.seats.to_a
    for round_num in (1..number_of_rounds)
      new_round = Round.create( game_id: @new_game.id,
        leader_id: user_array.first.user.id,
        blackcard_id: random_blackcard.id,
        round_num: round_num)
      @new_game.rounds << new_round
      @new_game.save
      user_array.rotate!
    end
  end

  def random_whitecard #add validation to prevent duplicate cards and offset is a valid Whitecard
    offset = rand(1..(Whitecard.count))
    Whitecard.find(offset)
  end

  def random_blackcard #add validation to prevent duplicate cards and offset is valid blackcard
    offset = rand(1..(Blackcard.count))
    Blackcard.find_by_id(offset)
  end
end

class RoundController
  def initialize(game_object, round_num)
    @game = game_object
    @seats = game_object.seats
    @round = @game.rounds[round_num-1]
    @submissions = []
  end

  def reveal_black_card #make sure this returns an ordered list
    return @round.blackcard.content
  end

  def make_submission(playable_card) #Make sure View checks that a user can only submit ONCE per round
    user = playable_card.seat
    @submissions << Submission.create(playable_card_id: playable_card.id, round_id: @round.id)
    playable_card.submitted = true
    playable_card.save
    check_if_all_cards_submitted
  end

  def round_leader_choose_winner(winning_submission)
    winning_submission.winner = true
    winning_submission.save
  end

  def tell_players_winning_card
    return @submissions.select{|card| card.winner == true }.first
  end

  private
  def check_if_all_cards_submitted
    if @submissions.length == @game.seats.length-1
      prompt_round_leader_for_decision
    else
      false
    end
  end

  def prompt_round_leader_for_decision #this method fires off action to show blackcard holder the sbumissions
    return @submissions
  end
end
