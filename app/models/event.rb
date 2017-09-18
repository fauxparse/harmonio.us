class Event < ApplicationRecord
  include Sluggable

  belongs_to :team
  has_many :existing_occurrences, class_name: 'Occurrence'

  validates :starts_at, presence: true
  validates :duration,
    presence: true,
    numericality: { only_integer: true, greater_than: 0 }
end
