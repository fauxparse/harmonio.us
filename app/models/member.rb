class Member < ApplicationRecord
  include Sluggable

  belongs_to :team

  validates :name, uniqueness: { scope: :team_id, case_sensitive: false }
end
