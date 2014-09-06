module Helper
  extend self
  def random_whitecard #add validation to prevent duplicate cards and offset is a valid Whitecard
    offset = rand(1..(Whitecard.count))
    Whitecard.find(offset)
  end

  def random_blackcard #add validation to prevent duplicate cards and offset is valid blackcard
    offset = rand(1..(Blackcard.count))
    Blackcard.find_by_id(offset)
  end
end
