class Event
  class Schedule
    attr_reader :event

    def initialize(event, recurrence_rule = nil)
      @event = event
      load_recurrence_rule(recurrence_rule)
    end

    def repeating?
      recurrence.present?
    end

    def start_time
      recurrence&.first || event.starts_at
    end

    def end_time
      if repeating?
        recurrence.finite? ? (recurrence.to_a.last + event.duration) : nil
      else
        start_time + (event.duration || 0)
      end
    end

    def period
      recurrence_options[:every]
    end

    def period=(period)
      build_recurrence(every: period)
    end

    def interval
      recurrence_options[:interval] || 1
    end

    def interval=(interval)
      build_recurrence(interval: interval)
    end

    def weekdays
      case period
      when :week then recurrence_options[:day] || [start_time.wday]
      when :month then recurrence_options[:day]
      end
    end

    def weekdays=(weekdays)
      case period
      when :week then build_recurrence(on: Array(weekdays).flatten)
      when :month then build_recurrence(day: weekdays)
      end
    end

    def count
      repeating? ? recurrence_options[:total] : 1
    end

    def count=(count)
      build_recurrence(total: count)
    end

    def between(start, stop)
      if overlaps?(start, stop)
        if repeating?
          recurrence.between(start...stop).to_a
        else
          [start_time]
        end
      else
        []
      end
    end

    def overlaps?(start, stop)
      start_time < stop && (end_time.nil? || end_time > start)
    end

    def dump
      recurrence && Montrose::Recurrence.dump(recurrence)
    end

    private

    attr_reader :recurrence

    def recurrence_options
      recurrence&.to_h || {}
    end

    def build_recurrence(options = {})
      @recurrence =
        Montrose::Recurrence
        .new(recurrence_options.merge(options).reject { |_, v| v.nil? }.to_h)
        .starts(event.starts_at)
        .at(event.starts_at.strftime('%H:%M:%S'))
    end

    def load_recurrence_rule(rule)
      @recurrence =
        case rule
        when Montrose::Recurrence then rule
        when String then Montrose::Recurrence.load(rule)
        end
    end
  end
end
