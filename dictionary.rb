class Dictionary

  def initialize(initial_hash={})
    @internal_hash = initial_hash
  end

  def to_json
    return @internal_hash.to_json
  end

  def add(key,value)
    if key.is_a?(String) && value.is_a?(String)
      @internal_hash[key] = value
    end
    return @internal_hash
  end

  def to_hash
    return @internal_hash
  end

end

# happy_things = Dictionary.new({
#   :happy => 'joy joy'
#   })
# json = happy_things.to_json
