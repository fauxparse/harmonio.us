class Event
  class Schedule
    include ActiveModel::Dirty

    attr_reader :event

    define_attribute_methods :period, :interval, :weekdays, :count

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
      recurrence_options[:every] || :once
    end

    def period=(value)
      period_will_change!
      if value.to_sym == :once
        @recurrence = nil
      else
        build_recurrence(every: value)
      end
    end

    def interval
      recurrence_options[:interval] || 1
    end

    def interval=(value)
      interval_will_change!
      build_recurrence(interval: value)
    end

    def weekdays
      case period
      when :week then recurrence_options[:day] || [start_time.wday]
      when :month then recurrence_options[:day]
      end
    end

    def weekdays=(value)
      weekdays_will_change!
      case period
      when :week then build_recurrence(on: Array(value).flatten)
      when :month then build_recurrence(day: value)
      end
    end

    def count
      repeating? ? recurrence_options[:total] : 1
    end

    def count=(value)
      count_will_change!
      build_recurrence(total: value)
    end

    def between(start, stop)
      if overlaps?(start, stop)
        if repeating?
          recurrence.between(start.to_date...stop.to_date).to_a
        else
          [start_time]
        end
      else
        []
      end
    end

    def include?(time)
      time == start_time || recurrence&.include?(time)
    end

    def overlaps?(start, stop)
      start_time < stop && (end_time.nil? || end_time > start)
    end

    def dump
      recurrence && Montrose::Recurrence.dump(recurrence)
    end

    private

    def recurrence
      @recurrence
         &.starts(event.starts_at)
         &.at(event.starts_at.strftime('%H:%M:%S'))
    end

    def recurrence_options
      @recurrence&.to_h || {}
    end

    def build_recurrence(options = {})
      @recurrence =
        Montrose::Recurrence
        .new(recurrence_options.merge(options).reject { |_, v| v.nil? }.to_h)
    end

    def load_recurrence_rule(rule)
      @recurrence =
        case rule
        when Montrose::Recurrence then rule
        when String then Montrose::Recurrence.load(rule)
        end
      build_recurrence if @recurrence
    end
  end
end
