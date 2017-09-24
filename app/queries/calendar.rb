class Calendar
  include Enumerable

  attr_reader :user, :start, :stop

  def initialize(user, start, stop)
    @user = user
    @start = start
    @stop = stop
  end

  def each(&block)
    occurrences.each(&block)
  end

  def events
    @events ||= user.events.between(start, stop)
  end

  def occurrences
    @occurrences ||=
      events
      .flat_map { |event| event.occurrences.between(start, stop) }
      .sort_by { |occurrence| [occurrence.starts_at, occurrence.event.name] }
  end

  def to_h
    occurrences.index_by { |occurrence| occurrence.starts_at.to_date }
  end

  alias to_ary occurrences
  alias to_a occurrences
end
