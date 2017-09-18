class Occurrence < ApplicationRecord
  belongs_to :event, inverse_of: :existing_occurrences

  before_validation :fill_in_ends_at, unless: :ends_at?

  validates :starts_at, :ends_at, presence: true
  validates :starts_at, uniqueness: { scope: :event_id }

  private

  def fill_in_ends_at
    self.ends_at = starts_at + event.duration
  end
end
