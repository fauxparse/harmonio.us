class Team < ApplicationRecord
  include Sluggable

  has_many :members, dependent: :destroy
  has_many :events, dependent: :destroy
end
