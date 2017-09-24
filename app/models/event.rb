class Event < ApplicationRecord
  include Sluggable

  belongs_to :team
  has_many :existing_occurrences,
    class_name: 'Occurrence',
    dependent: :destroy,
    autosave: true

  before_validation :save_schedule
  before_save :prune_occurrences, if: :schedule_changed?
  after_save :schedule_changes_applied, if: :schedule_changed?

  validates :starts_at, presence: true
  validates :duration,
    presence: true,
    numericality: { only_integer: true, greater_than: 0 }

  scope :between, ->(start, stop) {
    where('starts_at < ? AND (ends_at IS NULL OR ends_at >= ?)', stop, start)
  }

  def schedule
    @schedule ||= Schedule.new(self, recurrence_rule)
  end

  def schedule_attributes=(attributes)
    attributes.each do |key, value|
      schedule.send :"#{key}=", value
    end
  end

  def occurrences
    @occurrences ||= Occurrences.new(self)
  end

  private

  def save_schedule
    self.starts_at = schedule.start_time
    self.ends_at = schedule.end_time
    self.recurrence_rule = schedule.dump
  end

  def prune_occurrences
    occurrences.prune!
  end

  def schedule_changed?
    schedule.changed? ||
      saved_change_to_attribute?(:starts_at) ||
      saved_change_to_attribute?(:duration)
  end

  def schedule_changes_applied
    schedule.send(:changes_applied)
  end
end
