class Event < ApplicationRecord
  include Sluggable

  belongs_to :team
  has_many :existing_occurrences, class_name: 'Occurrence'

  before_validation :save_schedule

  validates :starts_at, presence: true
  validates :duration,
    presence: true,
    numericality: { only_integer: true, greater_than: 0 }

  def schedule
    @schedule ||= Schedule.new(self, recurrence_rule)
  end

  private

  def save_schedule
    self.starts_at = schedule.start_time
    self.ends_at = schedule.end_time
    self.recurrence_rule = schedule.dump
  end
end
