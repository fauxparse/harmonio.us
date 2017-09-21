class Event
  class Occurrences
    attr_reader :event

    def initialize(event)
      @event = event
    end

    def on(date)
      date = date.to_date
      at(schedule.between(date.midnight, date.succ.midnight).first)
    end

    def at(time)
      find_or_build(time) if schedule.include?(time)
    end

    def between(start, stop)
      schedule.between(start, stop).map { |time| at(time) }
    end

    def first
      at(schedule.start_time)
    end

    def reload
      existing.reload
      self
    end

    def prune!
      existing
        .reject { |occurrence| schedule.include?(occurrence.starts_at) }
        .map(&:mark_for_destruction)
    end

    delegate :schedule, to: :event

    private

    def existing
      event.existing_occurrences
    end

    def find_or_build(time)
      existing.detect { |occurrence| occurrence.starts_at == time } ||
        existing.build(starts_at: time)
    end
  end
end
