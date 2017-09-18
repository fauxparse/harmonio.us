class Event < ApplicationRecord
  include Sluggable

  belongs_to :team

  validates :starts_at, presence: true
  validates :duration,
    presence: true,
    numericality: { only_integer: true, greater_than: 0 }
end
